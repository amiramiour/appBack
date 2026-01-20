const Mission = require("./mission.model");
const User = require("./user.model");
const Candidature = require("./candidature.model");

/* =====================================================
   ASSOCIATIONS
   ===================================================== */

// ===== ENTREPRISE ↔ MISSIONS =====
Mission.belongsTo(User, {
  foreignKey: "employerId",
  as: "employer",
});

User.hasMany(Mission, {
  foreignKey: "employerId",
  as: "missions",
});

// ===== MISSION ↔ CANDIDATURES =====
Mission.hasMany(Candidature, {
  foreignKey: "missionId",
  as: "candidatures",
});

Candidature.belongsTo(Mission, {
  foreignKey: "missionId",
  as: "mission",
});

// ===== ÉTUDIANT ↔ CANDIDATURES =====
User.hasMany(Candidature, {
  foreignKey: "studentId",
  as: "candidatures",
});

Candidature.belongsTo(User, {
  foreignKey: "studentId",
  as: "student",
});

/* =====================================================
   EXPORT 
   ===================================================== */
module.exports = {
  Mission,
  User,
  Candidature,
};
