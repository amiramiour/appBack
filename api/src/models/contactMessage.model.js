const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class ContactMessage extends Model {}

ContactMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    isEmail: true,
  },
},
sujet: {
  type: DataTypes.STRING,
  allowNull: true,
},
    accepteConditions: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "ContactMessage",
    tableName: "contact_messages",
    timestamps: true,
  }
);

module.exports = ContactMessage;