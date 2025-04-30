import express from "express";
import {
  requestLeave,
  deleteLeaveRequest,
  rejectLeave,
  approveLeave,
  addLeave,
  updateLeave,
  deleteLeave,
  getEmployeeLeaves,
  getAllLeaveRequests,
  getLeaveById,
  getMyLeaves
} from "../controllers/leaveControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { Setting } from "../models/Setting.js";
import { get } from "mongoose";


const router = express.Router();


router.use(verifyToken);

// Employee routes
router.post("/requestLeave", requestLeave);
router.delete("/deleteLeaveRequest/:id", deleteLeaveRequest);
router.get("/employeeLeaves/:employeeId", getEmployeeLeaves);
router.get("/leave/:id", getLeaveById); 
router.get("/getLeaves", getMyLeaves); 

// Admin routes
router.use(verifyAdmin);

router.post("/approveLeave/:id", approveLeave);
router.post("/rejectLeave/:id", rejectLeave);
router.post("/addLeave", addLeave);
router.put("/updateLeave/:id", updateLeave);
router.delete("/deleteLeave/:id", deleteLeave);

router.get("/leaveRequests", getAllLeaveRequests);

router.post("/quota", async (req, res) => {
  const { value } = req.body;

  if (typeof value !== "number") {
    return res.status(400).json({ error: "Quota must be a number." });
  }

  const updated = await Setting.findOneAndUpdate(
    { key: "leaveQuota" },
    { value },
    { upsert: true, new: true }
  );

  res.json({ message: "Default leave quota updated.", quota: updated.value });
});



export default router;
