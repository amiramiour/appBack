const Document = require("../models/document.model");

const REQUIRED_DOCS = [
  "photo_identite",
  "titre_sejour",
  "certificat_scolarite",
  "rib"
];

exports.getUserDocuments = async (userId) => {
  return await Document.findAll({
  where: { userId, isGeneral: true },
  order: [["updatedAt", "DESC"]],
});

};


exports.getGlobalKycStatus = async (userId) => {
  const docs = await Document.findAll({ where: { userId } });

  const REQUIRED_DOCS = [
    "photo_identite",
    "titre_sejour",
    "certificat_scolarite",
    "rib",
  ];

  const deposited = docs.some(d => d.sentAt);

  const validated = REQUIRED_DOCS.every(type =>
    docs.some(
      d => d.docType === type && d.kycStatus === "VALIDATED"
    )
  );

  const refusedDocs = docs
    .filter(d => d.kycStatus === "REFUSED")
    .map(d => d.docType);
  const validatedDocs = docs
  .filter(d => d.kycStatus === "VALIDATED")
  .map(d => d.docType);


  const allRefused = REQUIRED_DOCS.every(type =>
    docs.some(
      d => d.docType === type && d.kycStatus === "REFUSED"
    )
  );

  const inReview =
    deposited &&
    !validated &&
    !allRefused;

  const depositedAt = deposited
    ? docs
        .filter(d => d.sentAt)
        .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))[0]
        ?.sentAt
    : null;

  const reviewStartedAt = docs.find(
    d => d.reviewStartedAt
  )?.reviewStartedAt || null;

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
if (!doc.reviewStartedAt) {
  doc.reviewStartedAt = new Date(); // admin a commencé
}

if (status === "VALIDATED" || status === "REFUSED") {
  doc.decisionAt = new Date(); // décision finale
}

if (comment) doc.statusComment = comment;

await doc.save();

  return doc;
};
