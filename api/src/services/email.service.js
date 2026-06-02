const { Resend } = require("resend");

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY non définie");
  }

  return new Resend(process.env.RESEND_API_KEY);
}

exports.sendPasswordResetEmail = async (email, resetLink) => {
  const resend = getResendClient();

  try {
    return await resend.emails.send({
      from: "LinkyJob <Linkyjob25@gmail.com>",
      to: email,
      subject: "Réinitialisation de votre mot de passe LinkyJob",
      html: `...`,
    });
  } catch (err) {
    throw new Error("Échec de l’envoi de l’email de réinitialisation");
  }
};