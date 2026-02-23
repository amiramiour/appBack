const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("RESEND KEY =", process.env.RESEND_API_KEY);
exports.sendContactNotification = async (data) => {
  return await resend.emails.send({
    from: "LinkyJob <onboarding@resend.dev>",
    to: "amiouramirtahar@gmail.com", 
    subject: " Nouveau message de contact",
    html: `
<div style="background-color:#f4f6f9;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
  <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <tr>
      <td style="background:#1e293b;padding:20px 30px;color:#ffffff;">
        <h2 style="margin:0;font-size:20px;"> Nouveau message - LinkyJob</h2>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:30px;color:#334155;">
        <p style="margin-top:0;font-size:15px;">Un nouveau message a été envoyé depuis le formulaire de contact :</p>

        <table width="100%" cellpadding="8" style="margin-top:20px;font-size:14px;">
          <tr>
            <td style="color:#64748b;"><strong>Nom :</strong></td>
            <td>${data.nom}</td>
          </tr>
          <tr>
            <td style="color:#64748b;"><strong>Prénom :</strong></td>
            <td>${data.prenom}</td>
          </tr>
          <tr>
            <td style="color:#64748b;"><strong>Email :</strong></td>
            <td>${data.email}</td>
          </tr>
          <tr>
            <td style="color:#64748b;"><strong>Sujet :</strong></td>
            <td>${data.sujet || "—"}</td>
          </tr>
        </table>

        <div style="margin-top:25px;padding:20px;background:#f1f5f9;border-radius:8px;">
          <strong>Message :</strong>
          <p style="margin:10px 0 0 0;line-height:1.6;">
            ${data.message}
          </p>
        </div>

        <div style="margin-top:30px;text-align:center;">
          <a href="mailto:${data.email}" 
             style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">
             Répondre au message
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#94a3b8;">
        © ${new Date().getFullYear()} LinkyJob — Tous droits réservés
      </td>
    </tr>

  </table>
</div>
`,
  });
};

exports.sendContactConfirmation = async (data) => {
  return await resend.emails.send({
    from: "LinkyJob <onboarding@resend.dev>",
    to: data.email,
    subject: "Nous avons bien reçu votre message",
    html: `
<div style="background-color:#f4f6f9;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
  <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <tr>
      <td style="background:#2563eb;padding:20px 30px;color:#ffffff;">
        <h2 style="margin:0;font-size:20px;">Merci pour votre message 💙</h2>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:30px;color:#334155;">
        <p style="font-size:15px;">Bonjour <strong>${data.prenom}</strong>,</p>

        <p style="line-height:1.6;">
          Nous avons bien reçu votre message et notre équipe va l’analyser rapidement.
        </p>

        <p style="line-height:1.6;">
          Nous reviendrons vers vous dans les plus brefs délais.
        </p>

        <div style="margin:30px 0;padding:20px;background:#f1f5f9;border-radius:8px;font-size:14px;">
          <strong>Récapitulatif de votre message :</strong>
          <p style="margin-top:10px;line-height:1.6;">
            ${data.message}
          </p>
        </div>

        <p style="margin-top:30px;">
          À très bientôt,<br/>
          <strong>L’équipe LinkyJob</strong>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#94a3b8;">
        © ${new Date().getFullYear()} LinkyJob — Tous droits réservés
      </td>
    </tr>

  </table>
</div>
`,
  });
};
exports.sendFeedbackNotification = async (data) => {
    console.log("DATA RECEIVED:", data);
  return await resend.emails.send({
    from: "LinkyJob <onboarding@resend.dev>",
    to: "amiouramirtahar@gmail.com",
    subject: "⭐ Nouveau feedback reçu",
    html: `
<div style="background-color:#f4f6f9;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
  <table align="center" width="600" cellpadding="0" cellspacing="0"
         style="background:#ffffff;border-radius:12px;overflow:hidden;
         box-shadow:0 4px 20px rgba(0,0,0,0.05);">

    <!-- Header -->
    <tr>
      <td style="background:#0f172a;padding:20px 30px;color:#ffffff;">
        <h2 style="margin:0;font-size:20px;">
          ⭐ Nouveau feedback utilisateur
        </h2>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:30px;color:#334155;line-height:1.6;">
        <p><strong>Nom :</strong> ${data.nom} ${data.prenom}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Type de profil :</strong> ${data.typeProfil}</p>

        <p style="font-size:18px;margin-top:15px;">
          <strong>Note :</strong> ${"⭐".repeat(data.note)} (${data.note}/5)
        </p>

        <p><strong>Tags :</strong> ${
        Array.isArray(data.tags)
            ? data.tags.join(", ")
            : data.tags
            ? JSON.parse(data.tags).join(", ")
            : "Aucun"
        }</p>
        <div style="margin-top:25px;padding:20px;background:#f1f5f9;border-radius:8px;">
          <strong>Message :</strong>
          <p style="margin-top:10px;">
            ${data.message}
          </p>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f8fafc;padding:20px;text-align:center;
                 font-size:12px;color:#94a3b8;">
        © ${new Date().getFullYear()} LinkyJob — Tous droits réservés
      </td>
    </tr>

  </table>
</div>
`,
  });
};