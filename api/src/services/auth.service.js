const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("./email.service");
const StudentProfile = require("../models/studentProfile.model");
exports.register = async (data) => {
  try {
    const { email, password, role } = data;

    if (!email || !password || !role) {
      throw new Error("Email, mot de passe et rôle sont requis");
    }

    if (!["student", "company"].includes(role)) {
      throw new Error("Rôle invalide");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Cet email est déjà utilisé");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let userPayload = {
      email,
      password: hashedPassword,
      role,
    };

    if (role === "student") {
  const {
    firstName,
    lastName,
    age,
    phone,
    training,
    school,

    // champs profil étudiant
    nationalites,
    competences,
    langues_parlees,
    missions_recherchees,
    disponibilites,
  } = data;

  if (!firstName || !lastName || !training) {
    throw new Error("Champs étudiant obligatoires manquants");
  }

  const newUser = await User.create({
    ...userPayload,
    firstName,
    lastName,
    age,
    phone,
    training,
    school,
  });

  await StudentProfile.create({
    userId: newUser.id,
    localisation: data.localisation,
    nationalites,
    competences,
    langues_parlees,
    disponibilites: disponibilites
  ? JSON.stringify(disponibilites)
  : null,
    missions_recherchees: missions_recherchees
      ? JSON.stringify(missions_recherchees)
      : null,
  });

  const token = jwt.sign(
    { sub: newUser.id, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const { password: _, ...userData } = newUser.toJSON();

  return { user: userData, token };
}

    if (role === "company") {
      const { companyName, companyType, companyId, address } = data;

      if (!companyName || !companyType) {
        throw new Error("Champs entreprise obligatoires manquants");
      }

      userPayload = {
        ...userPayload,
        companyName,
        companyType,
        companyId,
        address,
      };
      const newUser = await User.create(userPayload);

const token = jwt.sign(
  { sub: newUser.id, role: newUser.role },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

const { password: _, ...userData } = newUser.toJSON();

return { user: userData, token };
    }
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



exports.requestPasswordReset = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Utilisateur introuvable");

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 3600000); // 1h

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendPasswordResetEmail(email, resetLink);

  return { message: "Email de réinitialisation envoyé" };
};

exports.resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiry: { [require("sequelize").Op.gt]: new Date() },
    },
  });

  if (!user) throw new Error("Lien de réinitialisation invalide ou expiré");

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  return { message: "Mot de passe mis à jour avec succès" };
};