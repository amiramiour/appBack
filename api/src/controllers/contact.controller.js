const contactService = require("../services/contact.service");
const emailService = require("../services/resendEmail.service");
exports.createContactMessage = async (req, res) => {
  try {
    const message = await contactService.createMessage(req.body);
    await emailService.sendContactNotification(req.body);
    await emailService.sendContactConfirmation(req.body);
    res.status(201).json({
      message: "Message envoyé avec succès",
      data: message,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};