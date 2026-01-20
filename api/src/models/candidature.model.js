const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Candidature extends Model {}

Candidature.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    missionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "submitted",
        "under_review",
        "accepted",
        "rejected",
        "cancelled"
      ),
      defaultValue: "submitted",
    },
  },
  {
    sequelize,
    modelName: "Candidature",
    tableName: "candidatures",
    timestamps: true,
  }
);

module.exports = Candidature;
