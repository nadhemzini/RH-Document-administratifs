import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../utils/emailService.js";

export const addUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    let isAdmin = false;
    if (role === "admin" || role === "RH") {
      isAdmin = true;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isAdmin,
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: "User added successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
    sendWelcomeEmail(email, name, password);
  } catch (error) {
    console.error(`Add User Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};
