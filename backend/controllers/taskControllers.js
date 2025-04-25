import { Task } from "../models/Task";
import { Employee } from "../models/Employee";
import { Admin } from "../models/Admin";

export const addTask = async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;
  try {
    if (!title || !description || !assignedTo || !dueDate) {
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
      dueDate,
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
  const { title, description, dueDate } = req.body;
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
    if (dueDate) task.dueDate = dueDate;

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
