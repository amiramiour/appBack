const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// inscription
router.post("/register", authController.register);

// login
router.post("/login", authController.login);
router.post("/google", authController.googleLogin);

module.exports = router;
