const controller = require("../../controllers/me.controller");
const User = require("../../models/user.model");

jest.mock("../../models/user.model");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Me Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updateMe user not found", async () => {
    const req = {
      user: { id: 1 },
      body: {}
    };
    const res = mockRes();

    User.findByPk.mockResolvedValue(null);

    await controller.updateMe(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("updateMe student success", async () => {
    const req = {
      user: { id: 1 },
      body: {
        firstName: "Amir",
        training: "Dev"
      }
    };
    const res = mockRes();

    const mockUser = {
      role: "student",
      save: jest.fn()
    };

    User.findByPk.mockResolvedValue(mockUser);

    await controller.updateMe(req, res);

    expect(mockUser.firstName).toBe("Amir");
    expect(mockUser.training).toBe("Dev");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Profil mis à jour"
      })
    );
  });

  it("updateMe company success", async () => {
    const req = {
      user: { id: 1 },
      body: {
        companyName: "TestCorp",
        address: "Paris"
      }
    };
    const res = mockRes();

    const mockUser = {
      role: "company",
      save: jest.fn()
    };

    User.findByPk.mockResolvedValue(mockUser);

    await controller.updateMe(req, res);

    expect(mockUser.companyName).toBe("TestCorp");
    expect(mockUser.address).toBe("Paris");
  });

  it("updateMe ignores unauthorized fields", async () => {
    const req = {
      user: { id: 1 },
      body: {
        email: "hack@test.com"
      }
    };
    const res = mockRes();

    const mockUser = {
      role: "student",
      save: jest.fn()
    };

    User.findByPk.mockResolvedValue(mockUser);

    await controller.updateMe(req, res);

    expect(mockUser.email).toBeUndefined();
  });

  it("updateMe error", async () => {
    const req = {
      user: { id: 1 },
      body: {}
    };
    const res = mockRes();

    User.findByPk.mockRejectedValue(new Error("fail"));

    await controller.updateMe(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});