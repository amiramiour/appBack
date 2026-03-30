const request = require("supertest");
const app = require("../app");

jest.mock("../services/auth.service", () => ({
  login: jest.fn().mockResolvedValue({ token: "123" }),
  register: jest.fn().mockResolvedValue({ id: 1 }),
  requestPasswordReset: jest.fn().mockResolvedValue({ ok: true }),
  resetPassword: jest.fn().mockResolvedValue({ ok: true })
}));

jest.mock("../services/googleAuth.service", () => ({
  loginWithGoogle: jest.fn().mockResolvedValue({ token: "google" })
}));

describe("Auth Routes", () => {

  it("POST /auth/login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "123" });

    expect(res.statusCode).toBe(200);
  });

  it("POST /auth/register", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@test.com", password: "123", role: "student" });

    expect(res.statusCode).toBe(201);
  });

  it("POST /auth/google", async () => {
    const res = await request(app)
      .post("/auth/google")
      .send({ id_token: "token" });

    expect(res.statusCode).toBe(200);
  });

  it("POST /auth/forgot-password", async () => {
    const res = await request(app)
      .post("/auth/forgot-password")
      .send({ email: "test@test.com" });

    expect(res.statusCode).toBe(200);
  });

});