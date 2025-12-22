const authService = require("../services/auth.service");
const googleAuthService = require("../services/googleAuth.service");
const User = require("../models/user.model");  

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.googleLogin = async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ error: "Token manquant" });

    const data = await googleAuthService.loginWithGoogle(id_token);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Aucune image envoyée" });

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    user.photoUrl = req.file.path;
    await user.save();

    res.json({
      message: "Photo mise à jour",
      photoUrl: user.photoUrl,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

