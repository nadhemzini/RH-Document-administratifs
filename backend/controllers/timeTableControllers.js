import { TimeTable } from "../models/TimeTable.js";
import { Employee } from "../models/Employee.js";

export const createTimeTable = async (req, res) => {
  const { assignedTo, schedule } = req.body;

  try {
    const employee = await Employee.findById(assignedTo);
    if (!employee || employee.role !== "enseignant") {
      return res.status(400).json({
        success: false,
        message: "Assigned employee must have the role 'enseignant'.",
      });
    }

    const timeTable = new TimeTable({
      createdBy: req.userId,
      assignedTo,
      schedule,
    });

    await timeTable.save();

    res.status(201).json({
      success: true,
      message: "TimeTable created successfully",
      timeTable,
    });
  } catch (error) {
    console.error(`Create TimeTable Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTimeTableById = async (req, res) => {
  const { id } = req.params;

  try {
    const timeTable = await TimeTable.findById(id).populate(
      "assignedTo",
      "name"
    );
    if (!timeTable) {
      return res
        .status(404)
        .json({ success: false, message: "TimeTable not found" });
    }

    res.status(200).json({ success: true, timeTable });
  } catch (error) {
    console.error(`Get TimeTable By ID Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTimeTables = async (req, res) => {
  try {
    const timeTables = await TimeTable.find().populate("assignedTo", "name");
    res.status(200).json({ success: true, timeTables });
  } catch (error) {
    console.error(`Get All TimeTables Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTimeTable = async (req, res) => {
  const { id } = req.params;
  const { schedule } = req.body;

  try {
    const timeTable = await TimeTable.findById(id);
    if (!timeTable) {
      return res
        .status(404)
        .json({ success: false, message: "TimeTable not found" });
    }

    timeTable.schedule = schedule;
    await timeTable.save();

    res.status(200).json({
      success: true,
      message: "TimeTable updated successfully",
      timeTable,
    });
  } catch (error) {
    console.error(`Update TimeTable Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTimeTable = async (req, res) => {
  const { id } = req.params;

  try {
    const timeTable = await TimeTable.findById(id);
    if (!timeTable) {
      return res
        .status(404)
        .json({ success: false, message: "TimeTable not found" });
    }

    await timeTable.remove();

    res.status(200).json({
      success: true,
      message: "TimeTable deleted successfully",
    });
  } catch (error) {
    console.error(`Delete TimeTable Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyTimeTable = async (req, res) => {
  try {
    const employee = await Employee.findById(req.userId);
    if (!employee || employee.role !== "enseignant") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access restricted to enseignants only.",
        });
    }

    const timeTable = await TimeTable.findOne({ assignedTo: req.userId });
    if (!timeTable) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No timetable found for this employee.",
        });
    }

    res.status(200).json({ success: true, timeTable });
  } catch (error) {
    console.error(`Get My TimeTable Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
