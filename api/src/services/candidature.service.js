const Candidature = require("../models/candidature.model");
const Mission = require("../models/mission.model");
const User = require("../models/user.model");
const { Op } = require("sequelize");
const emailService = require("./resendEmail.service");

exports.applyToMission = async (studentId, missionId) => {
  const existingAccepted = await Candidature.findOne({
    where: {
      studentId,
      status: "accepted",
    },
  });

  if (existingAccepted) {
    throw new Error("Vous avez déjà une mission en cours");
  }

  const mission = await Mission.findByPk(missionId);

  if (!mission) {
    throw new Error("Mission introuvable");
  }

  if (mission.status !== "active") {
    throw new Error("Cette mission n'est plus disponible");
  }

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


exports.acceptCandidature = async (id, employerId) => {
  const candidature = await Candidature.findByPk(id, {
    include: [{ model: Mission, as: "mission" }],
  });

  if (!candidature) throw new Error("Candidature introuvable");
    if (candidature.status !== "under_review") {
  throw new Error("Candidature déjà traitée");
}
  const mission = candidature.mission;

  if (mission.employerId !== employerId) {
    throw new Error("Accès interdit");
  }

  if (mission.status !== "active") {
    throw new Error("Mission déjà traitée");
  }

  candidature.status = "accepted";
  await candidature.save();

  mission.status = "archivee";
  await mission.save();

  await Candidature.update(
    { status: "rejected" },
    {
      where: {
        missionId: candidature.missionId,
        id: { [Op.ne]: id },
      },
    }
  );

  const acceptedStudent = await User.findByPk(candidature.studentId);

  await emailService.sendCandidatureAccepted(
    acceptedStudent.email,
    acceptedStudent.firstName,
    mission.title
  );

  const rejectedCandidatures = await Candidature.findAll({
    where: {
      missionId: candidature.missionId,
      id: { [Op.ne]: id },
    },
  });

  for (const c of rejectedCandidatures) {
    const student = await User.findByPk(c.studentId);

    await emailService.sendCandidatureRejected(
      student.email,
      student.firstName,
      mission.title
    );
  }

  return candidature;
};

exports.rejectCandidature = async (id, employerId) => {
  const candidature = await Candidature.findByPk(id, {
    include: [{ model: Mission, as: "mission" }],
  });

  if (!candidature) throw new Error("Candidature introuvable");
    if (candidature.status !== "under_review") {
  throw new Error("Candidature déjà traitée");
}
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
