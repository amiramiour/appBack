const missionService = require("../services/mission.service");
const NodeCache = require("node-cache");

const missionCache = new NodeCache({ stdTTL: 30 });

exports.create = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ error: "Accès réservé aux employeurs" });
    }

    missionCache.del("missions");

    const mission = await missionService.createMission(req.body, req.user.id);
    res.status(201).json(mission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    //  Cache
    const cached = missionCache.get("missions");
    if (cached) {
      return res.json({ source: "cache", data: cached });
    }

    const missions = await missionService.getAllMissions();

    const plainMissions = missions.map(m =>
      m.get({ plain: true })
    );

    missionCache.set("missions", plainMissions);

    res.json({ source: "db", data: plainMissions });
  } catch (err) {
    console.error("Erreur dans list missions:", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
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

    missionCache.del("missions");

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getById = async (req, res) => {
  try {
    const mission = await missionService.getMissionById(req.params.id);

    if (!mission) {
      return res.status(404).json({ error: "Mission introuvable" });
    }

    res.json(mission.get({ plain: true }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
