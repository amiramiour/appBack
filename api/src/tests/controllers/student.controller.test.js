const controller = require("../../controllers/student.controller");
const User = require("../../models/user.model");
const StudentProfile = require("../../models/studentProfile.model");

jest.mock("../../models/user.model");
jest.mock("../../models/studentProfile.model");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Student Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== GET ALL STUDENTS =====
  it("getStudents success", async () => {
    const req = {};
    const res = mockRes();

    const mockStudents = [{ id: 1 }];

    User.findAll.mockResolvedValue(mockStudents);

    await controller.getStudents(req, res);

    expect(res.json).toHaveBeenCalledWith({
      data: mockStudents
    });
  });

  it("getStudents error", async () => {
    const req = {};
    const res = mockRes();

    User.findAll.mockRejectedValue(new Error("fail"));

    await controller.getStudents(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // ===== GET STUDENT BY ID =====
  it("getStudentById success", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    const mockStudent = { id: 1 };

    User.findOne.mockResolvedValue(mockStudent);

    await controller.getStudentById(req, res);

    expect(res.json).toHaveBeenCalledWith({
      data: mockStudent
    });
  });

  it("getStudentById not found", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    User.findOne.mockResolvedValue(null);

    await controller.getStudentById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("getStudentById error", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    User.findOne.mockRejectedValue(new Error("fail"));

    await controller.getStudentById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // ===== GET STUDENT PUBLIC =====
  it("getStudentPublicById success without profile", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    const mockStudent = {
      id: 1
    };

    User.findOne.mockResolvedValue(mockStudent);

    await controller.getStudentPublicById(req, res);

    expect(res.json).toHaveBeenCalledWith({
      data: mockStudent
    });
  });

  it("getStudentPublicById success with profile parsing", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    const mockStudent = {
      id: 1,
      profile: {
        missions_recherchees: JSON.stringify(["dev"]),
        disponibilites: JSON.stringify(["weekend"])
      }
    };

    User.findOne.mockResolvedValue(mockStudent);

    await controller.getStudentPublicById(req, res);

    expect(mockStudent.profile.missions_recherchees).toEqual(["dev"]);
    expect(mockStudent.profile.disponibilites).toEqual(["weekend"]);

    expect(res.json).toHaveBeenCalledWith({
      data: mockStudent
    });
  });

  it("getStudentPublicById not found", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    User.findOne.mockResolvedValue(null);

    await controller.getStudentPublicById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("getStudentPublicById error", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    User.findOne.mockRejectedValue(new Error("fail"));

    await controller.getStudentPublicById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});