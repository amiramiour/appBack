const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

// Public (pour landing page)
router.get("/", studentController.getStudents);
router.get("/:id", studentController.getStudentById);

module.exports = router;
