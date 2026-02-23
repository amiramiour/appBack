const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback.controller");
const rateLimit = require("express-rate-limit");

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 feedbacks par IP
  message: "Trop de tentatives, réessayez plus tard.",
});

router.post("/", feedbackLimiter, feedbackController.createFeedback);

module.exports = router;