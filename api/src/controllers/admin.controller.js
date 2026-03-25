const adminService = require("../services/admin.service");

exports.getUsers = async (req, res) => {
  try {
    const users = await adminService.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await adminService.deleteUser(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMissions = async (req, res) => {
  try {
    const missions = await adminService.getMissions();
    res.json(missions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMission = async (req, res) => {
  try {
    const result = await adminService.deleteMission(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCandidatures = async (req, res) => {
  try {
    const data = await adminService.getCandidatures();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentProfiles = async (req, res) => {
  try {
    const data = await adminService.getStudentProfiles();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

