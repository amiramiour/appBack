const controller = require("../../controllers/subscription.controller");
const service = require("../../services/subscription.service");

jest.mock("../../services/subscription.service");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Subscription Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== TYPE MANQUANT =====
  it("subscribe missing type", async () => {
    const req = {
      user: { id: 1 },
      body: {}
    };
    const res = mockRes();

    await controller.subscribe(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Type requis"
    });
  });

  // ===== SUCCESS =====
  it("subscribe success", async () => {
    const req = {
      user: { id: 1 },
      body: { type: "student" }
    };
    const res = mockRes();

    const mockUser = { id: 1, isPremium: true };

    service.subscribe.mockResolvedValue(mockUser);

    await controller.subscribe(req, res);

    expect(service.subscribe).toHaveBeenCalledWith(1, "student");

    expect(res.json).toHaveBeenCalledWith({
      message: "Abonnement activé",
      user: mockUser
    });
  });

  // ===== ERROR SERVICE =====
  it("subscribe error", async () => {
    const req = {
      user: { id: 1 },
      body: { type: "student" }
    };
    const res = mockRes();

    service.subscribe.mockRejectedValue(new Error("fail"));

    await controller.subscribe(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});