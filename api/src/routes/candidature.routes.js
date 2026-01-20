const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/candidature.controller");

const router = express.Router();

// Étudiant
router.post("/apply/:missionId", requireAuth, controller.apply);
router.get("/my", requireAuth, controller.studentHistory);
router.post("/cancel/:id", requireAuth, controller.cancel);

// Entreprise
router.get("/mission/:missionId", requireAuth, controller.missionCandidatures);
router.post("/accept/:id", requireAuth, controller.accept);
router.post("/reject/:id", requireAuth, controller.reject);

module.exports = router;
