const Feedback = require("../models/feedback.model");

exports.createFeedback = async (data) => {
  if (!data.nom || !data.prenom || !data.email || !data.message || !data.note) {
    throw new Error("Champs requis manquants");
  }

  if (!/\S+@\S+\.\S+/.test(data.email)) {
    throw new Error("Email invalide");
  }
  if (data.note < 1 || data.note > 5) {
  throw new Error("Note invalide");
}

  const feedback = await Feedback.create({
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    typeProfil: data.typeProfil,
    note: data.note,
tags: data.tags && data.tags.length > 0 
  ? JSON.stringify(data.tags) 
  : null,
      message: data.message,
    accepteConditions: data.accepteConditions,
  });

  return feedback;
};
exports.getAllFeedbacks = async () => {
  return await Feedback.findAll({
    where: { note: { [require("sequelize").Op.gte]: 3 } }, 
    order: [["createdAt", "DESC"]],
    limit: 10,
  });
};