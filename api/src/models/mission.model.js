const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Mission extends Model {}

Mission.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employerId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.ENUM("qualifiee", "generale"), allowNull: false },
    type: { type: DataTypes.ENUM("ponctuelle", "longue_duree", "teletravail"), allowNull: false },
    location: DataTypes.STRING,
    startDate: DataTypes.DATE,
    durationHours: DataTypes.INTEGER,
    remuneration: DataTypes.DECIMAL,
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
