const Mission = require("./mission.model");
const User = require("./user.model");

// 🔗 ASSOCIATIONS
Mission.belongsTo(User, {
  foreignKey: "employerId",
  as: "employer",
});

User.hasMany(Mission, {
  foreignKey: "employerId",
  as: "missions",
});

module.exports = {
  Mission,
  User,
};
