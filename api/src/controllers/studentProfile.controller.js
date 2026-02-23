const service = require("../services/studentProfile.service");

exports.getMyProfile = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ error: "Accès réservé aux étudiants" });
    }

    const profile = await service.getOrCreateProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ error: "Accès réservé aux étudiants" });
    }

    const profile = await service.updateProfile(req.user.id, req.body);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};