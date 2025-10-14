const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.register = async (data) => {
  try {
    const { email, password, role } = data;
    if (!email || !password || !role) {
      throw new Error("Email, mot de passe et rôle sont requis");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error("Cet email est déjà utilisé");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...data, password: hashedPassword });

    const token = jwt.sign(
      { sub: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //  Retour complet du profil (sauf le mot de passe)
    const { password: _, ...userData } = newUser.toJSON();

    return { user: userData, token };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.login = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Utilisateur introuvable");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Identifiants invalides");

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //  On retire le champ "password" mais on garde le reste
    const { password: _, ...userData } = user.toJSON();

    return { user: userData, token };
  } catch (error) {
    throw new Error(error.message);
  }
};
