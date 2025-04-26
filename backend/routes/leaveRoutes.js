import express from "express";
import {
  requestLeave,
  deleteLeaveRequest,
  rejectLeave,
  approveLeave,
  addLeave,
  updateLeave,
  deleteLeave,
} from "../controllers/leaveControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.use(verifyToken);

// Employee routes
router.post("/requestLeave", requestLeave);
router.delete("/deleteLeaveRequest/:id", deleteLeaveRequest);

// Admin routes
router.use(verifyAdmin);
router.post("/approveLeave/:id", approveLeave);
router.post("/rejectLeave/:id", rejectLeave);
router.post("/addLeave", addLeave);
router.put("/updateLeave/:id", updateLeave);
router.delete("/deleteLeave/:id", deleteLeave);

export default router;
