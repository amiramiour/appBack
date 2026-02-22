const User = require("../models/user.model");
const StudentProfile = require("../models/studentProfile.model");
exports.getStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: "student" },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "training",
        "school",
        "photoUrl",
        "createdAt"
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      data: students,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({
      where: {
        id: req.params.id,
        role: "student",
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "training",
        "school",
        "photoUrl",
        "createdAt"
      ],
    });

    if (!student) {
      return res.status(404).json({ error: "Étudiant introuvable" });
    }

    res.json({ data: student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getStudentPublicById = async (req, res) => {
  try {
    const student = await User.findOne({
      where: {
        id: req.params.id,
        role: "student",
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "age",
        "training",
        "school",
        "photoUrl",
      ],
      include: [
        {
          model: StudentProfile,
          as: "studentProfile",
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ error: "Étudiant introuvable" });
    }

    // Parser JSON
    if (student.profile) {
      if (student.profile.missions_recherchees) {
        student.profile.missions_recherchees =
          JSON.parse(student.profile.missions_recherchees);
      }

      if (student.profile.disponibilites) {
        student.profile.disponibilites =
          JSON.parse(student.profile.disponibilites);
      }
    }

    res.json({ data: student });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
