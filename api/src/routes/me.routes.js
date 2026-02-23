const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/me.controller");
const router = express.Router();
router.get("/profile", requireAuth, (req, res) => {
  res.json({ me: req.user });
});
router.put("/", requireAuth, controller.updateMe);


module.exports = router;
