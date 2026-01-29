const s3Service = require("../services/s3.service");
const documentService = require("../services/document.service");
const Document = require("../models/document.model");

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
const { Op } = require("sequelize");

exports.submitDossier = async (req, res) => {
  try {
    const userId = req.user.id;

    const REQUIRED_DOCS = [
      "photo_identite",
      "titre_sejour",
      "certificat_scolarite",
      "rib",
    ];

    const docs = await Document.findAll({
      where: {
        userId,
        docType: { [Op.in]: REQUIRED_DOCS },
      },
    });

    //  Tous les docs requis doivent exister
    const hasAllFiles = REQUIRED_DOCS.every(type =>
      docs.some(d => d.docType === type && d.fileUrl)
    );

    if (!hasAllFiles) {
      return res.status(400).json({
        error: "Documents requis manquants",
      });
    }

    //  Si TOUS validés → inutile de resoumettre
    const allValidated = docs.every(d => d.kycStatus === "VALIDATED");

    if (allValidated) {
      return res.status(400).json({
        error: "Le dossier est déjà validé",
      });
    }
      const hasAlreadyDeposited = docs.some(d => d.sentAt);

    //  On remet UNIQUEMENT les refusés en validation
    await Document.update(
  {
    kycStatus: "VALIDATION_ASKED",
    decisionAt: null,
    ...(hasAlreadyDeposited ? {} : { sentAt: new Date() }),
  },
  {
    where: {
      userId,
      docType: { [Op.in]: REQUIRED_DOCS },
      kycStatus: "REFUSED",
    },
  }
);


    res.json({ success: true });
  } catch (err) {
    console.error("submitDossier error:", err);
    res.status(500).json({ error: "Erreur soumission dossier" });
  }
};