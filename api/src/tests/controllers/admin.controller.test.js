const controller = require("../../controllers/admin.controller");
const adminService = require("../../services/admin.service");

jest.mock("../../services/admin.service");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Admin Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET USERS
  it("getUsers success", async () => {
    const req = {};
    const res = mockRes();

    adminService.getUsers.mockResolvedValue([{ id: 1 }]);

    await controller.getUsers(req, res);

    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it("getUsers error", async () => {
    const req = {};
    const res = mockRes();

    adminService.getUsers.mockRejectedValue(new Error("fail"));

    await controller.getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // DELETE USER
  it("deleteUser success", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    adminService.deleteUser.mockResolvedValue({ message: "ok" });

    await controller.deleteUser(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "ok" });
  });

  it("deleteUser error", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    adminService.deleteUser.mockRejectedValue(new Error("fail"));

    await controller.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // GET MISSIONS
  it("getMissions success", async () => {
    const req = {};
    const res = mockRes();

    adminService.getMissions.mockResolvedValue([]);

    await controller.getMissions(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("getMissions error", async () => {
    const req = {};
    const res = mockRes();

    adminService.getMissions.mockRejectedValue(new Error("fail"));

    await controller.getMissions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // DELETE MISSION
  it("deleteMission success", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    adminService.deleteMission.mockResolvedValue({ message: "ok" });

    await controller.deleteMission(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "ok" });
  });

  it("deleteMission error", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    adminService.deleteMission.mockRejectedValue(new Error("fail"));

    await controller.deleteMission(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // GET CANDIDATURES
  it("getCandidatures success", async () => {
    const req = {};
    const res = mockRes();

    adminService.getCandidatures.mockResolvedValue([]);

    await controller.getCandidatures(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("getCandidatures error", async () => {
    const req = {};
    const res = mockRes();

    adminService.getCandidatures.mockRejectedValue(new Error("fail"));

    await controller.getCandidatures(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // GET STUDENT PROFILES
  it("getStudentProfiles success", async () => {
    const req = {};
    const res = mockRes();

    adminService.getStudentProfiles.mockResolvedValue([]);

    await controller.getStudentProfiles(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("getStudentProfiles error", async () => {
    const req = {};
    const res = mockRes();

    adminService.getStudentProfiles.mockRejectedValue(new Error("fail"));

    await controller.getStudentProfiles(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});