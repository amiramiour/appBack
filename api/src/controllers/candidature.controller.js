const service = require("../services/candidature.service");

exports.apply = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ error: "Accès étudiant uniquement" });
    }

    const result = await service.applyToMission(
      req.user.id,
      req.params.missionId
    );

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.studentHistory = async (req, res) => {
  try {
    const data = await service.getStudentHistory(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.missionCandidatures = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ error: "Accès entreprise uniquement" });
    }

    const data = await service.getMissionCandidatures(
      req.params.missionId,
      req.user.id
    );

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.accept = async (req, res) => {
  try {
    const result = await service.acceptCandidature(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.reject = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ error: "Accès entreprise uniquement" });
    }

    const result = await service.rejectCandidature(
      req.params.id,
      req.user.id
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.cancel = async (req, res) => {
  try {
    const result = await service.cancelCandidature(
      req.params.id,
      req.user.id
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
