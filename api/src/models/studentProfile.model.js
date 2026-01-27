const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class StudentProfile extends Model {}

StudentProfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // 1 profil par étudiant
    },

    localisation: {
      type: DataTypes.STRING,
    },

    langues_parlees: {
      type: DataTypes.STRING,
    },

    competences: {
      type: DataTypes.TEXT,
    },

    disponibilites: {
      type: DataTypes.TEXT,
    },

    nationalites: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "StudentProfile",
    tableName: "student_profiles",
    timestamps: true,
  }
);

module.exports = StudentProfile;
