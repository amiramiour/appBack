const User = require("../models/user.model");

exports.updateMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    // Champs autorisés selon le rôle
    const allowedFields =
      user.role === "student"
        ? ["firstName", "lastName", "phone", "training", "school"]
        : ["companyName", "companyType", "companyId", "phone", "address"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      message: "Profil mis à jour",
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
