const ContactMessage = require("../models/contactMessage.model");

exports.createMessage = async (data) => {
  if (!data.nom || !data.prenom || !data.email || !data.message) {
    throw new Error("Tous les champs sont requis");
  }

  if (!/\S+@\S+\.\S+/.test(data.email)) {
    throw new Error("Email invalide");
  }

  const message = await ContactMessage.create({
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    sujet: data.sujet || null,
    message: data.message,
    accepteConditions: data.accepteConditions,
  });

  return message;
};