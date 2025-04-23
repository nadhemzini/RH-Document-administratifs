import mongoose from "mongoose";
import { AuditLog } from "../models/AuditLog.js";
import {User} from "../models/User.js";
import {Employee} from "../models/Employee.js";
import {Admin} from "../models/Admin.js";
import {Task} from "../models/Task.js";
import {Document} from "../models/Document.js";
import {Leave} from "../models/Leave.js";

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${con.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const logUpdate = async function (next) {
  try {
    const updatedFields = this.getUpdate();
    const originalDocument = await this.model.findOne(this.getQuery());

    await new AuditLog({
      action: "Update",
      entity: this.model.modelName,
      entityId: originalDocument._id,
      performedBy: this.options.userId || null, // Pass userId in query options
      details: {
        before: originalDocument,
        after: updatedFields,
      },
    }).save();

    next();
  } catch (error) {
    next(error);
  }
};

const logInsert = async function (next) {
  try {
    await new AuditLog({
      action: "Insert",
      entity: this.constructor.modelName,
      entityId: this._id,
      performedBy: this.userId || null, // Pass userId in the document if available
      details: this,
    }).save();

    next();
  } catch (error) {
    next(error);
  }
};

const logDelete = async function (next) {
  try {
    const documentToDelete = await this.model.findOne(this.getQuery());

    await new AuditLog({
      action: "Delete",
      entity: this.model.modelName,
      entityId: documentToDelete._id,
      performedBy: this.options.userId || null, // Pass userId in query options
      details: documentToDelete,
    }).save();

    next();
  } catch (error) {
    next(error);
  }
};

// Apply the middleware to all models
const models = [
  "User",
  "Employee",
  "Admin",
  "Task",
  "Document",
  "Leave",
];
models.forEach((modelName) => {
  const model = mongoose.model(modelName);
  model.schema.pre("findOneAndUpdate", logUpdate);
  model.schema.pre("updateOne", logUpdate);
  model.schema.pre("updateMany", logUpdate);
  model.schema.pre("save", logInsert);
  model.schema.pre("findOneAndDelete", logDelete);
  model.schema.pre("deleteOne", logDelete);
  model.schema.pre("deleteMany", logDelete);
});
