import mongoose from "mongoose";
import { AuditLog } from "../models/AuditLog.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["employee", "enseignant", "admin", "RH"],
      default: "employee",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    resetPasswordToken: String,
    restPasswordExpire: Date,
  },
  { timestamps: true, discriminatorKey: "kind" }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      await new AuditLog({
        action: "Create",
        entity: "User",
        entityId: this._id,
        details: this,
        performedBy: this._id, // Set performedBy to the user being created
      }).save();
    } else if (!this.isModified("lastLogin") && !this.isModified("status")) {
      // Skip logging for login and status updates
      const original = await this.constructor.findById(this._id);
      await new AuditLog({
        action: "Update",
        entity: "User",
        entityId: this._id,
        details: { before: original, after: this },
        performedBy: this._id, // Set performedBy to the user being updated
      }).save();
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre("remove", async function (next) {
  try {
    await new AuditLog({
      action: "Delete",
      entity: "User",
      entityId: this._id,
      details: this,
      performedBy: this._id, // Set performedBy to the user being deleted
    }).save();
    next();
  } catch (error) {
    next(error);
  }
});

export const User = mongoose.model("User", userSchema);
