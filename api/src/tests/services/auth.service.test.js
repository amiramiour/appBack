const service = require("../../services/auth.service");
const User = require("../../models/user.model");
const StudentProfile = require("../../models/studentProfile.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const emailService = require("../../services/email.service");

jest.mock("../../models/user.model");
jest.mock("../../models/studentProfile.model");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("crypto");
jest.mock("../../services/email.service");

describe("Auth Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("register student success", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed");

    const mockUser = {
      id: 1,
      role: "student",
      toJSON: () => ({ id: 1, role: "student" })
    };

    User.create.mockResolvedValue(mockUser);
    StudentProfile.create.mockResolvedValue({});
    jwt.sign.mockReturnValue("token");

    const result = await service.register({
      email: "test@test.com",
      password: "Password1!",
      role: "student",
      firstName: "a",
      lastName: "b",
      training: "dev"
    });

    expect(result.token).toBe("token");
  });

  it("register email exists", async () => {
    User.findOne.mockResolvedValue({ id: 1 });

    await expect(service.register({
      email: "test@test.com",
      password: "Password1!",
      role: "student"
    })).rejects.toThrow("Cet email est déjà utilisé");
  });

  it("login success", async () => {
    const mockUser = {
      id: 1,
      role: "student",
      password: "hashed",
      toJSON: () => ({ id: 1 })
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("token");

    const result = await service.login("test@test.com", "Password1!");

    expect(result.token).toBe("token");
  });

  it("login wrong password", async () => {
    User.findOne.mockResolvedValue({ password: "hashed" });
    bcrypt.compare.mockResolvedValue(false);

    await expect(service.login("test@test.com", "wrong"))
      .rejects
      .toThrow("Identifiants invalides");
  });

  it("requestPasswordReset success", async () => {
    const mockUser = {
      save: jest.fn()
    };

    User.findOne.mockResolvedValue(mockUser);
    crypto.randomBytes.mockReturnValue(Buffer.from("token"));
    emailService.sendPasswordResetEmail.mockResolvedValue();

    const result = await service.requestPasswordReset("test@test.com");

    expect(result.message).toBe("Email de réinitialisation envoyé");
  });

  it("requestPasswordReset user not found", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(service.requestPasswordReset("test@test.com"))
      .rejects
      .toThrow("Utilisateur introuvable");
  });

  it("resetPassword success", async () => {
    const mockUser = {
      save: jest.fn()
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.hash.mockResolvedValue("hashed");

    const result = await service.resetPassword("token", "Password1!");

    expect(result.message).toBe("Mot de passe mis à jour avec succès");
  });

  it("resetPassword invalid token", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(service.resetPassword("token", "Password1!"))
      .rejects
      .toThrow("Lien de réinitialisation invalide ou expiré");
  });

});