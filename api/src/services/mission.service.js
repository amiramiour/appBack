const Mission = require("../models/mission.model");

exports.createMission = async (data, employerId) => {
  return await Mission.create({ ...data, employerId });
};

exports.getAllMissions = async () => {
  return await Mission.findAll({ where: { status: "active" } });
};

exports.getMyMissions = async (employerId) => {
  return await Mission.findAll({ where: { employerId } });
};

exports.deleteMission = async (missionId, employerId) => {
  const mission = await Mission.findOne({ where: { id: missionId, employerId } });
  if (!mission) throw new Error("Mission introuvable ou non autorisée");
  await mission.destroy();
  return { message: "Mission supprimée avec succès" };
};
