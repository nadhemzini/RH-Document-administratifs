import mongoose from "mongoose";

const timeTableSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
    validate: {
      validator: async function (value) {
        const employee = await mongoose.model("Employee").findById(value);
        return employee && employee.role === "enseignant";
      },
      message: "Assigned employee must have the role 'enseignant'.",
    },
  },
  schedule: [
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TimeTable = mongoose.model("TimeTable", timeTableSchema);

export { TimeTable };
