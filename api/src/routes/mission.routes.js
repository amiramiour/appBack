const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/mission.controller");

const router = express.Router();

router.get("/", controller.list);
router.get("/my", requireAuth, controller.myMissions);
router.get("/:id", controller.getById);

router.post("/", requireAuth, controller.create);
router.delete("/:id", requireAuth, controller.delete);

module.exports = router;
