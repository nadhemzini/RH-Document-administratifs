import express from "express";
import {
  createTimeTable,
  getTimeTableById,
  getAllTimeTables,
  updateTimeTable,
  deleteTimeTable,
  getMyTimeTable,
} from "../controllers/timeTableControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.use(verifyToken);

// Admin routes
router.use(verifyAdmin);

router.post("/create", createTimeTable);
router.get("/:id", getTimeTableById);
router.get("/", getAllTimeTables);
router.put("/update/:id", updateTimeTable);
router.delete("/delete/:id", deleteTimeTable);
router.get("/myTimeTable", getMyTimeTable);

export default router;
