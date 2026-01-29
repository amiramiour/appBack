const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const Document = require("../models/document.model");
const s3 = require("../config/s3");

exports.getPresignedUrl = async (user, docType) => {
  if (!docType) throw new Error("Le type de document est requis");

  const bucket = process.env.AWS_BUCKET_NAME;
  const timestamp = Date.now();
  const key = `${user.id}/${timestamp}_${docType}.pdf`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: "application/pdf", // à adapter selon le type du fichier
  });

  const url = await getSignedUrl(s3, command, {
    expiresIn: parseInt(process.env.AWS_URL_EXPIRATION || "3600"), // 1h par défaut
  });

  return { uploadUrl: url, s3Key: key };
};

exports.confirmUpload = async (user, docType, s3Key) => {
  if (!s3Key) throw new Error("S3 key manquante");

  const existing = await Document.findOne({
    where: {
      userId: user.id,
      docType,
    },
  });

  if (existing) {
    existing.fileUrl = s3Key;
    existing.kycStatus = "CREATED";
    existing.sentAt = null;
    existing.reviewStartedAt = null;
    existing.decisionAt = null;
    await existing.save();
    return existing;
  }

  return await Document.create({
    userId: user.id,
    docType,
    fileUrl: s3Key,
    kycStatus: "CREATED",
  });
};
