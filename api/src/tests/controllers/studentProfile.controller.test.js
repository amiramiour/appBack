const controller = require("../../controllers/studentProfile.controller");
const service = require("../../services/studentProfile.service");

jest.mock("../../services/studentProfile.service");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("StudentProfile Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== GET PROFILE =====

  it("getMyProfile forbidden (not student)", async () => {
    const req = { user: { role: "company", id: 1 } };
    const res = mockRes();

    await controller.getMyProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("getMyProfile success", async () => {
    const req = { user: { role: "student", id: 1 } };
    const res = mockRes();

    const mockProfile = { id: 1 };

    service.getOrCreateProfile.mockResolvedValue(mockProfile);

    await controller.getMyProfile(req, res);

    expect(res.json).toHaveBeenCalledWith(mockProfile);
  });

  it("getMyProfile error", async () => {
    const req = { user: { role: "student", id: 1 } };
    const res = mockRes();

    service.getOrCreateProfile.mockRejectedValue(new Error("fail"));

    await controller.getMyProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // ===== UPDATE PROFILE =====

  it("updateMyProfile forbidden (not student)", async () => {
    const req = {
      user: { role: "company", id: 1 },
      body: {}
    };
    const res = mockRes();

    await controller.updateMyProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("updateMyProfile success", async () => {
    const req = {
      user: { role: "student", id: 1 },
      body: { localisation: "Paris" }
    };
    const res = mockRes();

    const mockProfile = { id: 1 };

    service.updateProfile.mockResolvedValue(mockProfile);

    await controller.updateMyProfile(req, res);

    expect(service.updateProfile).toHaveBeenCalledWith(1, req.body);
    expect(res.json).toHaveBeenCalledWith(mockProfile);
  });

  it("updateMyProfile error", async () => {
    const req = {
      user: { role: "student", id: 1 },
      body: {}
    };
    const res = mockRes();

    service.updateProfile.mockRejectedValue(new Error("fail"));

    await controller.updateMyProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});