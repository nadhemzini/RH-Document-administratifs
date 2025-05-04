import { Leave } from "../models/Leave.js";
import { Setting } from "../models/Setting.js";
import { Employee } from "../models/Employee.js";
import { Admin } from "../models/Admin.js";
import { User } from "../models/User.js";

export const requestLeave = async (req, res) => {
  const { type, startDate, endDate, reason } = req.body;

  try {
    if (!type || !startDate || !endDate || !reason) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const employee = await User.findById(req.userId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const leaveDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

    
    if (employee.leaveBalance < leaveDays) {
      return res.status(400).json({ success: false, message: "Insufficient leave balance" });
    }

    employee.leaveBalance -= leaveDays;
    await employee.save();

    const quotaSetting = await Setting.findOne({ key: "leaveQuota" });
    const defaultQuota = quotaSetting?.value ?? 10;

    const leave = new Leave({
      requestedBy: req.userId,
      type,
      startDate,
      endDate,
      reason,
      status: "Pending",
      quota: defaultQuota,
    });

    await leave.save();

    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      leave,
    });
  } catch (error) {
    console.error(`Request Leave Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ requestedBy: req.userId });
    res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error(`Get My Leaves Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLeaveRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const leave = await Leave.findOne({
      _id: id,
      requestedBy: req.userId,
      status: "Pending",
    });
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Pending leave request not found" });
    }

    await leave.remove();

    res.status(200).json({
      success: true,
      message: "Leave request deleted successfully",
    });
  } catch (error) {
    console.error(`Delete Leave Request Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const rejectLeave = async (req, res) => {
  const { id } = req.params;
  try {
    const leave = await Leave.findById(id);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave request not found" });
    }

    leave.status = "Rejected";
    leave.approvedBy = req.userId;
    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave request rejected successfully",
      leave,
    });
  } catch (error) {
    console.error(`Reject Leave Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const approveLeave = async (req, res) => {
  const { id } = req.params;
  try {
    const leave = await Leave.findById(id);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave request not found" });
    }

    leave.status = "Approved";
    leave.approvedBy = req.userId;
    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave request approved successfully",
      leave,
    });
  } catch (error) {
    console.error(`Approve Leave Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addLeave = async (req, res) => {
  const { requestedBy, type, startDate, endDate, reason, status, quota } =
    req.body;
  try {
    if (
      !requestedBy ||
      !type ||
      !startDate ||
      !endDate ||
      !reason ||
      !status ||
      quota === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const leave = new Leave({
      requestedBy,
      type,
      startDate,
      endDate,
      reason,
      status,
      quota,
    });

    await leave.save();

    res.status(201).json({
      success: true,
      message: "Leave added successfully",
      leave,
    });
  } catch (error) {
    console.error(`Add Leave Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateLeave = async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, reason, status, quota } = req.body;
  try {
    const leave = await Leave.findById(id);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }

    if (startDate) leave.startDate = startDate;
    if (endDate) leave.endDate = endDate;
    if (reason) leave.reason = reason;
    if (status) leave.status = status;
    if (quota) leave.quota = quota;

    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave updated successfully",
      leave,
    });
  } catch (error) {
    console.error(`Update Leave Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteLeave = async (req, res) => {
  const { id } = req.params;
  try {
    const leave = await Leave.findById(id);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }

    await leave.remove();

    res.status(200).json({
      success: true,
      message: "Leave deleted successfully",
    });
  } catch (error) {
    console.error(`Delete Leave Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getEmployeeLeaves = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const leaves = await Leave.find({
      requestedBy: employeeId,
    });
    res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error(`Get Employee Leaves Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await Leave.find({ status: "Pending" })
      .populate("requestedBy", "name")
      .select("-approvedBy");
    res.status(200).json({ success: true, leaveRequests });
  } catch (error) {
    console.error(`Get All Leave Requests Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("requestedBy", "name")
      .populate("approvedBy", "name")
      .select("-__v");

    res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error(`Get All Leaves Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaveById = async (req, res) => {
  const { id } = req.params;
  try {
    const leave = await Leave.findById(id).populate("requestedBy", "name");
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }
    res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error(`Get Leave By ID Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
