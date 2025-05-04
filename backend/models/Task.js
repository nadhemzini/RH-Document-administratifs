import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: false, 
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status:{
    type: String,
    required: true,
    enum: ["Pending", "Completed", "Past Deadline"],
    default: "employee",
  },
  deadline: {
    type: Date,
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

export { Task };
