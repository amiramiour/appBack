const Candidature = require("../models/candidature.model");
const Mission = require("../models/mission.model");
const User = require("../models/user.model");
const { Op } = require("sequelize");

exports.applyToMission = async (studentId, missionId) => {
  // Vérifier si une candidature existe déjà
  let candidature = await Candidature.findOne({
    where: { studentId, missionId },
  });

  if (candidature) {

    if (["rejected", "cancelled"].includes(candidature.status)) {
      candidature.status = "under_review";
      return await candidature.save();
    }
    throw new Error("Vous avez déjà une candidature active pour cette mission");
  }

  return await Candidature.create({
    studentId,
    missionId,
    status: "under_review",
  });
};

exports.getStudentHistory = async (studentId) => {
  return await Candidature.findAll({
    where: { studentId },
    include: [
      { 
        model: Mission,
        as: "mission" 
      }
    ],
    order: [["createdAt", "DESC"]],
  });
};


exports.getMissionCandidatures = async (missionId, employerId) => {
  const mission = await Mission.findByPk(missionId);

  if (!mission) {
    throw new Error("Mission introuvable");
  }

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

  // On peut annuler seulement si c'est en cours de traitement
  if (candidature.status !== "under_review") {
    throw new Error("Impossible d’annuler une candidature traitée");
  }

  // Option 1 : Suppression définitive (plus propre pour l'historique si on annule)
  // await candidature.destroy(); 
  
  // Option 2 : Marquer comme annulée (pour garder une trace)
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
