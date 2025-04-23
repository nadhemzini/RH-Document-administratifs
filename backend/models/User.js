import mongoose from "mongoose";

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
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
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
  { timestamps: true }
);

userSchema.pre("remove", async function (next) {
  try {
    // Remove the user from all discriminator collections
    const discriminatorModels = Object.keys(mongoose.connection.models).filter(
      (modelName) =>
        mongoose.connection.models[modelName].baseModelName === "User"
    );

    for (const modelName of discriminatorModels) {
      await mongoose.connection.models[modelName].findByIdAndDelete(this._id);
    }

    next();
  } catch (error) {
    next(error);
  }
});

export const User = mongoose.model("User", userSchema);
