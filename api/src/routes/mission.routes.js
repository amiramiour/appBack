const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/mission.controller");

const router = express.Router();

// accessible à tous
router.get("/", controller.list);

// protégées
router.post("/", requireAuth, controller.create);
router.get("/my", requireAuth, controller.myMissions);
router.delete("/:id", requireAuth, controller.delete);

module.exports = router;
