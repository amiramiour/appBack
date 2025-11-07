const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const data = await resend.emails.send({
      from: "LinkyJob <Linkyjob25@gmail.com>",
      to: email,
      subject: "Réinitialisation de votre mot de passe LinkyJob",
      html: `
        <p>Bonjour,</p>
        <p>Pour réinitialiser votre mot de passe, cliquez sur le lien ci-dessous :</p>
        <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
        <p>Ce lien expirera dans 1 heure.</p>
      `,
    });

    console.log("Email envoyé :", data);
    return data;
  } catch (err) {
    console.error("Erreur Resend :", err);
    throw new Error("Échec de l’envoi de l’email de réinitialisation");
  }
};
