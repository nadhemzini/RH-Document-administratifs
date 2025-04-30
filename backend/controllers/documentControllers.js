import { Document } from "../models/Document.js";

export const requestDocument = async (req, res) => {
  try {
    const { type } = req.body;
    const document = new Document({
      type,
      requestedBy: req.userId,
    });
    await document.save();
    res.status(201).json({
      success: true,
      message: "Document requested successfully",
      document,
    });
  } catch (error) {
    console.error(`Request Document Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);
    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }
    await document.remove();
    res
      .status(200)
      .json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error(`Delete Document Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDocumentsByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const documents = await Document.find({ requestedBy: employeeId });
    res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error(`Get Documents By Employee ID Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);
    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }
    res.status(200).json({ success: true, document });
  } catch (error) {
    console.error(`Get Document By ID Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);
    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }
    document.status = "Verified";
    document.verifiedBy = req.userId;
    document.dateVerified = new Date();
    await document.save();
    res.status(200).json({
      success: true,
      message: "Document approved successfully",
      document,
    });
  } catch (error) {
    console.error(`Approve Document Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);
    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }
    document.status = "Rejected";
    document.verifiedBy = req.userId;
    document.dateVerified = new Date();
    await document.save();
    res.status(200).json({
      success: true,
      message: "Document rejected successfully",
      document,
    });
  } catch (error) {
    console.error(`Reject Document Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error(`Get All Documents Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ status: "Pending" });
    res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error(`Get Pending Documents Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getApprovedDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ status: "Verified" });
    res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error(`Get Approved Documents Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRejectedDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ status: "Rejected" });
    res.status(200).json({ success: true, documents });
  } catch (error) {
    console.error(`Get Rejected Documents Error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
