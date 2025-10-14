const authService = require("../services/auth.service");
const googleAuthService = require("../services/googleAuth.service");

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