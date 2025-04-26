import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending",
    required: true,
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

const Document = mongoose.model("Document", documentSchema);

export { Document };
