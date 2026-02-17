const Document = require("../models/document.model");

const ALL_DOCS = [
  "photo_identite",
  "titre_sejour",
  "certificat_scolarite",
  "diplome",
  "rib",
  "justificatif_domicile",
  "charte_engagement",
];


exports.getUserDocuments = async (userId) => {
  return await Document.findAll({
  where: { userId, isGeneral: true },
  order: [["updatedAt", "DESC"]],
});

};


exports.getGlobalKycStatus = async (userId) => {
  const docs = await Document.findAll({ where: { userId } });

  const deposited = docs.some(d => d.sentAt);

  const validatedDocs = docs
    .filter(d => d.kycStatus === "VALIDATED")
    .map(d => d.docType);

  const refusedDocs = docs
    .filter(d => d.kycStatus === "REFUSED")
    .map(d => d.docType);

  const validated = ALL_DOCS.every(type =>
    validatedDocs.includes(type)
  );

  const allRefused = ALL_DOCS.every(type =>
    refusedDocs.includes(type)
  );


const reviewStartedAt =
  docs.find(d => d.reviewStartedAt)?.reviewStartedAt || null;

const inReview = !!reviewStartedAt;

  const depositedAt = deposited
    ? docs
        .filter(d => d.sentAt)
        .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))[0]
        ?.sentAt
    : null;

  const decisionAt =
    validated || allRefused
      ? docs
          .filter(d => d.decisionAt)
          .sort((a, b) => new Date(b.decisionAt) - new Date(a.decisionAt))[0]
          ?.decisionAt
      : null;

  return {
    deposited,
    inReview,
    validated,
    refused: allRefused,
    refusedDocs,
    validatedDocs,
    depositedAt,
    reviewStartedAt,
    decisionAt,
  };
};


exports.updateDocumentStatus = async (docId, status, comment) => {
  const doc = await Document.findByPk(docId);
  if (!doc) throw new Error("Document introuvable");

  doc.kycStatus = status;

  // 1️⃣ Si premier traitement admin → démarrage étude
  if (!doc.reviewStartedAt) {
    doc.reviewStartedAt = new Date();
  }

  if (comment) doc.statusComment = comment;

  await doc.save();

  // 2️⃣ Vérifier état global du dossier
  const docs = await Document.findAll({ where: { userId: doc.userId } });

  const allValidated = docs.every(d => d.kycStatus === "VALIDATED");
  const allRefused = docs.every(d => d.kycStatus === "REFUSED");

  if (allValidated || allRefused) {
    // 3️⃣ Mettre decisionAt si pas déjà mis
    await Document.update(
      { decisionAt: new Date() },
      { where: { userId: doc.userId, decisionAt: null } }
    );
  }

  return doc;
};
