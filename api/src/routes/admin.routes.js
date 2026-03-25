const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { requireAuth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

router.use(requireAuth, isAdmin);

// USERS
router.get("/users", adminController.getUsers);
router.delete("/users/:id", adminController.deleteUser);

// MISSIONS
router.get("/missions", adminController.getMissions);
router.delete("/missions/:id", adminController.deleteMission);

// CANDIDATURES
router.get("/candidatures", adminController.getCandidatures);

// STUDENT PROFILES
router.get("/student-profiles", adminController.getStudentProfiles);

module.exports = router;