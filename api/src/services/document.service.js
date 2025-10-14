const Document = require("../models/document.model");

const REQUIRED_DOCS = [
  "photo_identite",
  "titre_sejour",
  "certificat_scolarite",
  "rib"
];

exports.getUserDocuments = async (userId) => {
  return await Document.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
};


exports.getGlobalKycStatus = async (userId) => {
  const docs = await Document.findAll({ where: { userId } });

  // on garde uniquement les docs validés
  const validated = docs
    .filter(d => d.kycStatus === "VALIDATED")
    .map(d => d.docType);

  // on regarde lesquels manquent
  const missing = REQUIRED_DOCS.filter(d => !validated.includes(d));

  return {
    ok: missing.length === 0,
    validated,
    missing,
    required: REQUIRED_DOCS
  };
};


exports.updateDocumentStatus = async (docId, status, comment) => {
  const doc = await Document.findByPk(docId);
  if (!doc) throw new Error("Document introuvable");
  doc.kycStatus = status;
  if (comment) doc.statusComment = comment;
  await doc.save();
  return doc;
};
