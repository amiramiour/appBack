const { User, Mission, Candidature, StudentProfile } = require("../models");

exports.getUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
  });
};

exports.deleteUser = async (id) => {
  const user = await User.findByPk(id);

  if (!user) throw new Error("Utilisateur introuvable");

  if (user.role === "admin") {
    throw new Error("Impossible de supprimer un admin");
  }

  await user.destroy();
  return { message: "Utilisateur supprimé" };
};

exports.getMissions = async () => {
  return await Mission.findAll({
    include: [
      {
        model: User,
        as: "employer",
        attributes: ["id", "companyName"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

exports.deleteMission = async (id) => {
  const mission = await Mission.findByPk(id);

  if (!mission) throw new Error("Mission introuvable");

  await mission.destroy();
  return { message: "Mission supprimée" };
};

exports.getCandidatures = async () => {
  return await Candidature.findAll({
    include: [
      {
        model: User,
        as: "student",
        attributes: ["id", "email"],
      },
      {
        model: Mission,
        as: "mission",
        attributes: ["id", "title"],
      },
    ],
  });
};

exports.getStudentProfiles = async () => {
  return await StudentProfile.findAll({
    include: [
      {
        model: User,
        as: "student",
        attributes: ["id", "email"],
      },
    ],
  });
};

