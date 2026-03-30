const controller = require("../../controllers/auth.controller");

const authService = require("../../services/auth.service");
const googleAuthService = require("../../services/googleAuth.service");
const User = require("../../models/user.model");

jest.mock("../../services/auth.service");
jest.mock("../../services/googleAuth.service");
jest.mock("../../models/user.model");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // REGISTER
  it("register success", async () => {
    const req = { body: { email: "test@test.com" } };
    const res = mockRes();

    authService.register.mockResolvedValue({ id: 1 });

    await controller.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("register error", async () => {
    const req = { body: {} };
    const res = mockRes();

    authService.register.mockRejectedValue(new Error("fail"));

    await controller.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // LOGIN
  it("login success", async () => {
    const req = { body: { email: "a", password: "b" } };
    const res = mockRes();

    authService.login.mockResolvedValue({ token: "x" });

    await controller.login(req, res);

    expect(res.json).toHaveBeenCalledWith({ token: "x" });
  });

  it("login error", async () => {
    const req = { body: {} };
    const res = mockRes();

    authService.login.mockRejectedValue(new Error("fail"));

    await controller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // GOOGLE LOGIN
  it("googleLogin missing token", async () => {
    const req = { body: {} };
    const res = mockRes();

    await controller.googleLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("googleLogin success", async () => {
    const req = { body: { id_token: "token" } };
    const res = mockRes();

    googleAuthService.loginWithGoogle.mockResolvedValue({ token: "x" });

    await controller.googleLogin(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("googleLogin error", async () => {
    const req = { body: { id_token: "token" } };
    const res = mockRes();

    googleAuthService.loginWithGoogle.mockRejectedValue(new Error("fail"));

    await controller.googleLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // FORGOT PASSWORD
  it("forgotPassword success", async () => {
    const req = { body: { email: "test@test.com" } };
    const res = mockRes();

    authService.requestPasswordReset.mockResolvedValue({ ok: true });

    await controller.forgotPassword(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("forgotPassword error", async () => {
    const req = { body: {} };
    const res = mockRes();

    authService.requestPasswordReset.mockRejectedValue(new Error("fail"));

    await controller.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // RESET PASSWORD
  it("resetPassword success", async () => {
    const req = {
      params: { token: "123" },
      body: { newPassword: "Pass123!" }
    };
    const res = mockRes();

    authService.resetPassword.mockResolvedValue({ ok: true });

    await controller.resetPassword(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("resetPassword error", async () => {
    const req = { params: {}, body: {} };
    const res = mockRes();

    authService.resetPassword.mockRejectedValue(new Error("fail"));

    await controller.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // UPLOAD PHOTO
  it("uploadPhoto missing file", async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();

    await controller.uploadPhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("uploadPhoto user not found", async () => {
    const req = {
      file: { filename: "img.png" },
      user: { id: 1 }
    };
    const res = mockRes();

    User.findByPk.mockResolvedValue(null);

    await controller.uploadPhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("uploadPhoto success", async () => {
    const mockUser = {
      save: jest.fn()
    };

    const req = {
      file: { filename: "img.png" },
      user: { id: 1 }
    };
    const res = mockRes();

    User.findByPk.mockResolvedValue(mockUser);

    await controller.uploadPhoto(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Photo mise à jour"
      })
    );
  });

  it("uploadPhoto error", async () => {
    const req = {
      file: { filename: "img.png" },
      user: { id: 1 }
    };
    const res = mockRes();

    User.findByPk.mockRejectedValue(new Error("fail"));

    await controller.uploadPhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});