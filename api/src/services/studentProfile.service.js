const StudentProfile = require("../models/studentProfile.model");

exports.getOrCreateProfile = async (userId) => {
  const [profile] = await StudentProfile.findOrCreate({
    where: { userId },
    defaults: { userId },
  });

  return profile;
};

exports.updateProfile = async (userId, data) => {
  const profile = await StudentProfile.findOne({ where: { userId } });

  if (!profile) {
    throw new Error("Profil étudiant introuvable");
  }

  await profile.update({
    localisation: data.localisation,
    langues_parlees: data.langues_parlees,
    competences: data.competences,
    disponibilites: data.disponibilites,
    nationalites: data.nationalites,
  });

  return profile;
};