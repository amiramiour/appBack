const s3Service = require("../services/s3.service");
const documentService = require("../services/document.service");

exports.getPresignedUrl = async (req, res) => {
  try {
    const { type } = req.query;
    const data = await s3Service.getPresignedUrl(req.user, type);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.confirmUpload = async (req, res) => {
  try {
    const { type, s3Key } = req.body;
    const doc = await s3Service.confirmUpload(req.user, type, s3Key);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.myDocuments = async (req, res) => {
  try {
    const docs = await documentService.getUserDocuments(req.user.id);
    res.json(docs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.kycStatus = async (req, res) => {
  try {
    const status = await documentService.getGlobalKycStatus(req.user.id);
    res.json(status);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const doc = await documentService.updateDocumentStatus(req.params.id, status, comment);
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};