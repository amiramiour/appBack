const express = require("express");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/profile", requireAuth, (req, res) => {
  res.json({ me: req.user });
});

module.exports = router;
