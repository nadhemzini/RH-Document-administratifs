import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";
import { sendResetSuccess } from "../utils/emailService.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = generateTokenAndSetCookie(res, user._id, user.kind); // Generate token
    user.lastLogin = Date.now();
    user.status = "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token, // Include token in the response body
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error(`Login Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const restToken = crypto.randomBytes(20).toString("hex");
    const restTokenExpire = Date.now() + 60 * 60 * 1000;

    user.resetPasswordToken = restToken;
    user.restPasswordExpire = restTokenExpire;

    await user.save();

    await sendPasswordResetEmail(
      user.name,
      user.email,
      restToken,
      new Date(restTokenExpire).toDateString()
    );

    res
      .status(200)
      .json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    console.error(`Forgot Password Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      restPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.restPasswordExpire = undefined;
    await user.save();

    await sendResetSuccess(user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(`Reset Password Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(`Check Auth Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};
