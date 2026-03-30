const service = require("../../services/subscription.service");
const { User } = require("../../models");

jest.mock("../../models", () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

describe("Subscription Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("subscribe success", async () => {
    const mockUser = {
      isPremium: false,
      subscriptionType: null,
      save: jest.fn(),
    };

    User.findByPk.mockResolvedValue(mockUser);

    const result = await service.subscribe(1, "student");

    expect(mockUser.isPremium).toBe(true);
    expect(mockUser.subscriptionType).toBe("student");
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toBe(mockUser);
  });

  it("subscribe user not found", async () => {
    User.findByPk.mockResolvedValue(null);

    await expect(service.subscribe(1, "student"))
      .rejects
      .toThrow("User introuvable");
  });

});