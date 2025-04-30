import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
    required: true,
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: false,
  },
  dateRequested: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dateVerified: {
    type: Date,
  },
  quota: {
    type: Number,
    required: true,
  },
  
});

const Leave = mongoose.model("Leave", leaveSchema);

export { Leave };
