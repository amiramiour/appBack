const User = require("../models/user.model");

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
