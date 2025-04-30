import { Task } from "../models/Task.js";
import { Employee } from "../models/Employee.js";
import { Admin } from "../models/Admin.js";

export const addTask = async (req, res) => {
  const { title, description, assignedTo, deadline } = req.body;
  try {
    if (!title || !description || !assignedTo || !deadline) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Assigned employee not found" });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      deadline,
      assignedBy: req.userId,
      status: "Pending",
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: "Task assigned successfully",
      task,
    });
  } catch (error) {
    console.error(`Add Task Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline } = req.body;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.assignedBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (deadline) task.deadline = deadline;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error(`Update Task Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.assignedBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    await task.remove();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(`Delete Task Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markTaskAsComplete = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.assignedTo.toString() !== req.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    task.status = "Completed";
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task marked as completed",
      task,
    });
  } catch (error) {
    console.error(`Mark Task As Complete Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTasksEmployee = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.userId });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error(`Get Tasks Employee Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedBy: req.userId });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error(`Get Assigned Tasks Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssignedTasksById = async (req, res) => {
  const { id } = req.params;
  try {
    const tasks = await Task.find({ assignedBy: req.userId, assignedTo: id });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error(`Get Assigned Tasks By ID Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error(`Get Task By ID Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
