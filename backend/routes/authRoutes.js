import express from "express";
import {
  login,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/authControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
export default router;
