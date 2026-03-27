const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/subscription.controller");

router.post("/", requireAuth, controller.subscribe);

module.exports = router;