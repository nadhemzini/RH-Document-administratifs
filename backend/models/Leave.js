const leaveSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
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
});

const Leave = mongoose.model("Leave", leaveSchema);

export { Leave };
