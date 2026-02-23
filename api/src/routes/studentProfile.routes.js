const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/studentProfile.controller");

const router = express.Router();

router.get("/me", requireAuth, controller.getMyProfile);
router.put("/me", requireAuth, controller.updateMyProfile);

module.exports = router;