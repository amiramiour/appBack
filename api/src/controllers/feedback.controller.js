const feedbackService = require("../services/feedback.service");
const emailService = require("../services/resendEmail.service");
exports.createFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.createFeedback(req.body);
    await emailService.sendFeedbackNotification(req.body);
    res.status(201).json({
      message: "Merci pour votre avis !",
      data: feedback,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};