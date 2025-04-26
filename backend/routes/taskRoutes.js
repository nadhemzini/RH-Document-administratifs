import express from "express";
import {
  addTask,
  updateTask,
  markTaskAsComplete,
  deleteTask,
} from "../controllers/taskControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.use(verifyToken);

// Employee routes
router.post("/markTaskAsComplete/:id", markTaskAsComplete);

// Admin routes
router.use(verifyAdmin);
router.post("/addTask", addTask);
router.put("/updateTask/:id", updateTask);
router.delete("/deleteTask/:id", deleteTask);

export default router;
