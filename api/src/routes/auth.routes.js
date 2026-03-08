const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth"); // 🟢 OBLIGATOIRE
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `user-${req.user.id}-${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });


router.post(
  "/upload-photo",
  requireAuth,                //  Vérifie le token
  upload.single("photo"),     //  Fichier envoyé
  authController.uploadPhoto  //  Contrôleur correct
);

// Auth classiques
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleLogin);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
