import mongoose from "mongoose";
import { User } from "./User.js";
import { AuditLog } from "./AuditLog.js";

const employeeSchema = new mongoose.Schema({
  nationalId: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  maritalStatus: {
    type: String,
    required: true,
  },
  employmentDate: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  disability: {
    type: Boolean,
    default: false,
  },
  grade: {
    type: String,
    required: true,
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
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
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
        performedBy: this.userId || null,
        details: leave,
      }).save();
    }
    await this.model("Leave").deleteMany({ requestedBy: this._id });

    // Log deletion of documents requested by this employee
    const documents = await this.model("Document").find({
      requestedBy: this._id,
    });
    for (const document of documents) {
      await new AuditLog({
        action: "Delete",
        entity: "Document",
        entityId: document._id,
        performedBy: this.userId || null,
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
