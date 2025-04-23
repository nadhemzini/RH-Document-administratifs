import mongoose from "mongoose";
import { User } from "./User.js";

const adminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

adminSchema.pre("remove", async function (next) {
  try {
    // Replace the admin ID with null in approved leaves and given tasks
    await this.model("Leave").updateMany(
      { approvedBy: this._id },
      { $set: { approvedBy: null } }
    );

    await this.model("Task").updateMany(
      { assignedBy: this._id },
      { $set: { assignedBy: null } }
    );

    next();
  } catch (error) {
    next(error);
  }
});

const Admin = User.discriminator("Admin", adminSchema);

export { Admin };
