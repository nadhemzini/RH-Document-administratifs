import mongoose from "mongoose";
import { Employee } from "./Employee.js";

const professorSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
    unique: true,
  },
});

professorSchema.pre("remove", async function (next) {
  try {
    // Remove the professor from the Employee collection
    await this.model("Employee").findByIdAndDelete(this.employeeId);
    next();
  } catch (error) {
    next(error);
  }
});

const Professor = Employee.discriminator("Professor", professorSchema);

export { Professor };
