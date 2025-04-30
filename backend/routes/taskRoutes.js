import express from "express";
import {
  addTask,
  updateTask,
  markTaskAsComplete,
  deleteTask,
  getTasksEmployee,
  getAssignedTasks,
  getAssignedTasksById,
  getTaskById,
} from "../controllers/taskControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.use(verifyToken);

// Employee routes
router.post("/markTaskAsComplete/:id", markTaskAsComplete);

router.get("/getTasks", getTasksEmployee); // Get all tasks assigned to the employee that is logged in

router.get("/assignedTasks", getAssignedTasks); // Get all the tasks assigned by the admin that is logged in

router.get("/assignedTasksById/:id", getAssignedTasksById); // Get all the tasks of a certain employee assigned by the admin that is logged in 

router.get("/getTask/:id", getTaskById); // Get a task by its ID


// Admin routes
router.use(verifyAdmin);

router.post("/addTask", addTask);
router.put("/updateTask/:id", updateTask);
router.delete("/deleteTask/:id", deleteTask);

export default router;
