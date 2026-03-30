const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");

jest.mock("../../models/user.model");
jest.mock("jsonwebtoken");

// mock clean de google
const mockVerify = jest.fn();

jest.mock("google-auth-library", () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: mockVerify
    }))
  };
});

const service = require("../../services/googleAuth.service");

describe("Google Auth Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("login existing user", async () => {
    mockVerify.mockResolvedValue({
      getPayload: () => ({
        email: "test@test.com",
        given_name: "John",
        family_name: "Doe"
      })
    });

    const mockUser = {
      id: 1,
      role: "student",
      toJSON: () => ({ id: 1, role: "student", password: "x" })
    };

    User.findOne.mockResolvedValue(mockUser);
    jwt.sign.mockReturnValue("token");

    const result = await service.loginWithGoogle("token");

    expect(result.token).toBe("token");
    expect(result.user.id).toBe(1);
  });

  it("create new user", async () => {
    mockVerify.mockResolvedValue({
      getPayload: () => ({
        email: "new@test.com",
        given_name: "Jane",
        family_name: "Doe"
      })
    });

    User.findOne.mockResolvedValue(null);

    const createdUser = {
      id: 2,
      role: "student",
      toJSON: () => ({ id: 2, role: "student", password: "" })
    };

    User.create.mockResolvedValue(createdUser);
    jwt.sign.mockReturnValue("token");

    const result = await service.loginWithGoogle("token");

    expect(result.user.id).toBe(2);
  });

  it("error case", async () => {
    mockVerify.mockRejectedValue(new Error("fail"));

    await expect(service.loginWithGoogle("bad"))
      .rejects
      .toThrow("Erreur d'authentification Google");
  });

});