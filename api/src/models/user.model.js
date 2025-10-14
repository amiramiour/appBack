const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    role: { type: DataTypes.ENUM("student", "company"), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    // Étudiant
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    field: DataTypes.STRING,
    training: DataTypes.STRING,
    school: DataTypes.STRING,
    // Entreprise
    companyName: DataTypes.STRING,
    companyType: DataTypes.ENUM("SARL", "SAS", "AUTO_ENTREPRENEUR"),
    companyId: DataTypes.STRING,
    address: DataTypes.STRING,
    legalEmail: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
