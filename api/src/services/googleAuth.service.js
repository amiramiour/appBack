const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.loginWithGoogle = async (idToken) => {
  try {
    // Vérification du token Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    if (!email) throw new Error("Impossible de récupérer l'email Google");

    // Vérifie si l'utilisateur existe déjà
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Crée un utilisateur étudiant par défaut
      user = await User.create({
        email,
        role: "student",
        firstName: given_name,
        lastName: family_name,
        password: "", // inutile, car connexion Google
      });
    }

    // Génère ton propre token JWT LinkyJob
    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // On retire le mot de passe de la réponse
    const { password, ...userData } = user.toJSON();

    return { user: userData, token };
  } catch (err) {
    throw new Error("Erreur d'authentification Google : " + err.message);
  }
};
