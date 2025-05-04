import express from "express";
import {
  addUser,
  updateUser,
  deleteUser,
  updateEmployee,
  getEmployee,
  getAllEmployees,
  getUser,
  getAllUsers,
  getUserById,
  getUserName,
  getEnseignant,
  getAllEnseignants,
  countUsersByRole,
} from "../controllers/crudControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.use(verifyToken);

// Employee routes
router.post("/updateEmployee/:id", updateEmployee);
router.get("/getEmployee/:id", getEmployee);
router.get("/getEmployees", getAllEmployees);
router.get("/getUser/:id", getUser);
router.get("/getUsers", getAllUsers);
router.get("/getUserById/:id", getUserById);
router.get("/getUserName/:id", getUserName);
router.get("/getEnseignant/:id", getEnseignant);
router.get("/getEnseignants", getAllEnseignants); 

router.get("/countUsersByRole/:role", countUsersByRole);

// Admin routes
router.post("/addUser", verifyAdmin, addUser);
router.put("/updateUser/:id", verifyAdmin, updateUser);
router.delete("/deleteUser/:id", verifyAdmin, deleteUser);

export default router;
