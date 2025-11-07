const missionService = require("../services/mission.service");
const NodeCache = require("node-cache");

// 🧠 Cache mémoire avec TTL = 30 secondes
const missionCache = new NodeCache({ stdTTL: 30 });

exports.create = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ error: "Accès réservé aux employeurs" });
    }

    // Lorsqu'on crée une mission → on vide le cache
    missionCache.del("missions");

    const mission = await missionService.createMission(req.body, req.user.id);
    res.status(201).json(mission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    // 🔹 Vérifie le cache
    const cached = missionCache.get("missions");
    if (cached) {
      return res.json({ source: "cache", data: cached });
    }

    // 🔹 Si pas dans le cache → récupère depuis la DB
    const missions = await missionService.getAllMissions();

    // 🔹 Stocke dans le cache pour 30s
    missionCache.set("missions", missions);

    res.json({ source: "db", data: missions });
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

    // 🧹 Supprime le cache si une mission est supprimée
    missionCache.del("missions");

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
