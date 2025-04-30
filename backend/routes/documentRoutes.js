import express from "express";
import {
  requestDocument,
  deleteDocument,
  getDocumentsByEmployeeId,
  getDocumentById,
  approveDocument,
  rejectDocument,
  getAllDocuments,
  getPendingDocuments,
  getApprovedDocuments,
  getRejectedDocuments,
} from "../controllers/documentControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { Document } from "../models/Document.js";

const router = express.Router();

router.use(verifyToken);

// Employee routes

router.post("/requestDocument", requestDocument);
router.delete("/deleteDocumentRequest/:id", deleteDocument);

router.get("/getDocumentsByEmployeeId/:employeeId", getDocumentsByEmployeeId);
router.get("/getDocumentById/:id", getDocumentById); // Get a document by its ID

// Admin routes
router.use(verifyAdmin);

router.delete("/deleteDocument/:id", deleteDocument); // Admin can also delete documents
router.put("/approveDocument/:id", approveDocument); // Admin can approve documents
router.put("/rejectDocument/:id", rejectDocument); // Admin can reject documents

router.get("/getAllDocuments", getAllDocuments); // Admin can get all documents
router.get("/PendingDocuments", getPendingDocuments); // Admin can get all pending documents
router.get("/ApprovedDocuments", getApprovedDocuments); // Admin can get all approved documents
router.get("/RejectedDocuments", getRejectedDocuments); // Admin can get all rejected documents

export default router;
