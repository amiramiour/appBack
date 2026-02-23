const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Mission extends Model {}

Mission.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    employerId: { type: DataTypes.INTEGER, allowNull: false },

    // FRONT : intitule
    title: { type: DataTypes.STRING, allowNull: false },

    // FRONT : description
    description: { type: DataTypes.TEXT, allowNull: false },

    // FRONT : type (libre)
    type: { type: DataTypes.STRING, allowNull: false },

    // FRONT : niveau
    niveau: { type: DataTypes.STRING },

    // FRONT : lieu
    location: { type: DataTypes.STRING },

    // FRONT : dateDebut
    startDate: { type: DataTypes.DATE },

    // FRONT : duree
    durationHours: { type: DataTypes.STRING },

    // FRONT : rémunération
    remuneration: { type: DataTypes.DECIMAL },

    // FRONT : conditions (checkbox)
    conditions: { type: DataTypes.BOOLEAN, defaultValue: false },
    
    // laissé comme avant
    status: {
      type: DataTypes.ENUM("active", "expiree", "archivee"),
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "Mission",
    tableName: "missions",
    timestamps: true,
  }
);


module.exports = Mission;
