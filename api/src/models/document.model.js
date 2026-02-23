const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Document extends Model {}

Document.init(
  {
    sentAt: DataTypes.DATE,
reviewStartedAt: DataTypes.DATE,
decisionAt: DataTypes.DATE,

    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    docType: {
      type: DataTypes.ENUM(
        "photo_identite",
        "titre_sejour",
        "certificat_scolarite",
        "diplome",
        "rib",
        "justificatif_domicile",
        "charte_engagement",
        "autre"
      ),
      allowNull: false,
    },
    fileUrl: { type: DataTypes.STRING },
    kycStatus: {
      type: DataTypes.ENUM("CREATED", "VALIDATION_ASKED", "VALIDATED", "REFUSED"),
      defaultValue: "CREATED",
    },
    statusComment: { type: DataTypes.TEXT },
    isGeneral: { type: DataTypes.BOOLEAN, defaultValue: true },
    missionId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: "Document",
    tableName: "documents",
    timestamps: true,
  }
);

module.exports = Document;
