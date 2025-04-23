import mongoose from "mongoose";
import { Employee } from "./Employee.js";
import { AuditLog } from "./AuditLog.js";

const administrativeEmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
    unique: true,
  },
});

administrativeEmployeeSchema.pre("remove", async function (next) {
  try {
    // Remove the administrative employee from the Employee collection
    await this.model("Employee").findByIdAndDelete(this.employeeId);

    // Log deletion of tasks assigned to this administrative employee
    const tasks = await this.model("Task").find({ assignedTo: this._id });
    for (const task of tasks) {
      await new AuditLog({
        action: "Delete",
        entity: "Task",
        entityId: task._id,
        performedBy: this.userId || null, 
        details: task,
      }).save();
    }
    await this.model("Task").deleteMany({ assignedTo: this._id });

    next();
  } catch (error) {
    next(error);
  }
});

const AdministrativeEmployee = Employee.discriminator(
  "AdministrativeEmployee",
  administrativeEmployeeSchema
);

export { AdministrativeEmployee };
