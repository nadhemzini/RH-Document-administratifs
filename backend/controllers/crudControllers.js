import { User } from "../models/User.js";
import { Employee } from "../models/Employee.js";
import { Admin } from "../models/Admin.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../utils/emailService.js";
import { generatePassword } from "../utils/passwordGenerator.js";

export const addUser = async (req, res) => {
  const { name, email, role, ...additionalDetails } = req.body;
  try {
    if (!name || !email || !role) {
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

    const password = generatePassword(); // Generate a random password
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (role === "admin" || role === "RH") {
      user = new Admin({
        name,
        email,
        password: hashedPassword,
        role,
      });
    } else if (role === "employee" || role === "enseignant") {
      user = new Employee({
        name,
        email,
        password: hashedPassword,
        role,
        ...additionalDetails,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role specified" });
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: "User added successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
    sendWelcomeEmail(email, name, password); // Send the generated password in the welcome email
  } catch (error) {
    console.error(`Add User Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (req.userId !== id && req.kind !== "Admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role && req.kind == "Admin") user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error(`Update User Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (req.userId !== id && user.kind !== "Admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(`Delete User Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    nationalId,
    dateOfBirth,
    gender,
    maritalStatus,
    employmentDate,
    department,
    address,
    phone,
    disability,
    grade,
    gradeDate,
    leaveBalance,
    academicYear,
  } = req.body;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID is required" });
    }

    const employee = await User.findOne({ _id: id, kind: "Employee" });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Check if the requester is the employee or an admin
    if (req.userId !== id && req.kind !== "Admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    // Update employee-specific fields
    if (nationalId) employee.nationalId = nationalId;
    if (dateOfBirth) employee.dateOfBirth = dateOfBirth;
    if (gender) employee.gender = gender;
    if (maritalStatus) employee.maritalStatus = maritalStatus;
    if (employmentDate) employee.employmentDate = employmentDate;
    if (department) employee.department = department;
    if (address) employee.address = address;
    if (phone) employee.phone = phone;
    if (disability !== undefined) employee.disability = disability;
    if (grade) employee.grade = grade;
    if (gradeDate) employee.gradeDate = gradeDate;
    if (leaveBalance !== undefined) employee.leaveBalance = leaveBalance;
    if (academicYear) employee.academicYear = academicYear;

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error(`Update Employee Error: ${error.message}`);
    res.status(400).json({ success: false, message: error.message });
  }
};
