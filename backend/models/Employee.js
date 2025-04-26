import mongoose from "mongoose";
import { User } from "./User.js";
import { AuditLog } from "./AuditLog.js";

const employeeSchema = new mongoose.Schema({
  nationalId: {
    type: String,
    required: false,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: false,
  },
  maritalStatus: {
    type: String,
    required: false,
  },
  employmentDate: {
    type: Date,
    required: false,
  },
  department: {
    type: String,
    enum: ["Administrative", "Math", "Informatics", "Technology"],
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  disability: {
    type: Boolean,
    default: false,
  },
  grade: {
    type: String,
    required: false,
  },
  gradeDate: {
    type: Date,
  },
  leaveBalance: {
    type: Number,
    default: 0.0,
  },
  academicYear: {
    type: String,
    required: true,
    default: new Date().getFullYear().toString(),
  },
});

employeeSchema.pre("remove", async function (next) {
  try {
    // Log deletion of leaves requested by this employee
    const leaves = await this.model("Leave").find({ requestedBy: this._id });
    for (const leave of leaves) {
      await new AuditLog({
        action: "Delete",
        entity: "Leave",
        entityId: leave._id,
        performedBy: this._id, // Set performedBy to the user or employee ID
        details: leave,
      }).save();
    }
    await this.model("Leave").deleteMany({ requestedBy: this._id });

    const tasks = await this.model("Task").find({ assignedTo: this._id });
    for (const task of tasks) {
      await new AuditLog({
        action: "Delete",
        entity: "Task",
        entityId: task._id,
        performedBy: this._id, // Set performedBy to the user or employee ID
        details: task,
      }).save();
    }
    await this.model("Task").deleteMany({ assignedTo: this._id });

    // Log deletion of documents requested by this employee
    const documents = await this.model("Document").find({
      requestedBy: this._id,
    });
    for (const document of documents) {
      await new AuditLog({
        action: "Delete",
        entity: "Document",
        entityId: document._id,
        performedBy: this._id, // Set performedBy to the user or employee ID
        details: document,
      }).save();
    }
    await this.model("Document").deleteMany({ requestedBy: this._id });

    next();
  } catch (error) {
    next(error);
  }
});

const Employee = User.discriminator("Employee", employeeSchema);

export { Employee };
