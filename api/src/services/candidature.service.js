const Candidature = require("../models/candidature.model");
const Mission = require("../models/mission.model");

exports.applyToMission = async (studentId, missionId) => {
  const exists = await Candidature.findOne({
    where: { studentId, missionId },
  });

  if (exists) {
    throw new Error("Vous avez déjà postulé à cette mission");
  }

  return await Candidature.create({
    studentId,
    missionId,
    status: "submitted",
  });
};

exports.getStudentHistory = async (studentId) => {
  return await Candidature.findAll({
    where: { studentId },
    include: [
      {
        model: Mission,
        as: "mission", //  ALIAS EXACT
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};


exports.getMissionCandidatures = async (missionId, employerId) => {
  const mission = await Mission.findByPk(missionId);

  if (!mission) {
    throw new Error("Mission introuvable");
  }

  // SÉCURITÉ CRITIQUE
  if (mission.employerId !== employerId) {
    throw new Error("Accès interdit à cette mission");
  }

  return await Candidature.findAll({
    where: { missionId },
    include: ["student"], 
    order: [["createdAt", "DESC"]],
  });
};


exports.acceptCandidature = async (id) => {
  const candidature = await Candidature.findByPk(id);
  if (!candidature) throw new Error("Candidature introuvable");

  // Accepter celle-ci
  candidature.status = "accepted";
  await candidature.save();

  // Refuser toutes les autres candidatures de l'étudiant
  await Candidature.update(
    { status: "rejected" },
    {
      where: {
        studentId: candidature.studentId,
        id: { [require("sequelize").Op.ne]: id },
      },
    }
  );

  return candidature;
};

exports.rejectCandidature = async (id, employerId) => {
  const candidature = await Candidature.findByPk(id, {
    include: [{ model: Mission, as: "mission" }],
  });

  if (!candidature) throw new Error("Candidature introuvable");

  if (candidature.mission.employerId !== employerId) {
    throw new Error("Accès interdit");
  }

  candidature.status = "rejected";
  await candidature.save();

  return candidature;
};


exports.cancelCandidature = async (id, studentId) => {
  const candidature = await Candidature.findByPk(id);

  if (!candidature) {
    throw new Error("Candidature introuvable");
  }

  if (candidature.studentId !== studentId) {
    throw new Error("Action interdite");
  }

  //  Interdictions métier
  if (["accepted", "rejected", "cancelled"].includes(candidature.status)) {
    throw new Error(
      "Impossible d’annuler une candidature déjà traitée"
    );
  }

  candidature.status = "cancelled";
  await candidature.save();

  return candidature;
};

exports.getCompanyCandidatures = async (employerId) => {
  return await Candidature.findAll({
    include: [
      {
        model: Mission,
        as: "mission",
        where: { employerId },
        attributes: ["id", "title"]
      },
      {
        model: User,
        as: "student",
        attributes: ["id", "firstName", "lastName", "photoUrl", "training"]
      }
    ],
    order: [["createdAt", "DESC"]],
  });
};
