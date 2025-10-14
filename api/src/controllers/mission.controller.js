const missionService = require("../services/mission.service");

exports.create = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ error: "Accès réservé aux employeurs" });
    }
    const mission = await missionService.createMission(req.body, req.user.id);
    res.status(201).json(mission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const missions = await missionService.getAllMissions();
    res.json(missions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.myMissions = async (req, res) => {
  try {
    const missions = await missionService.getMyMissions(req.user.id);
    res.json(missions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await missionService.deleteMission(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
