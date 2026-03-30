const request = require("supertest");

jest.mock("../config/database", () => ({
  authenticate: jest.fn().mockResolvedValue()
}));

jest.mock("../config/logger", () => ({
  info: jest.fn(),
  error: jest.fn()
}));

jest.mock("../config/metrics", () => ({
  register: { metrics: jest.fn(), contentType: "text/plain" },
  httpRequestCounter: { inc: jest.fn() },
  httpRequestDuration: { observe: jest.fn() }
}));

jest.mock("../models/user.model", () => ({}));
jest.mock("../models/mission.model", () => ({}));
jest.mock("../models/candidature.model", () => ({}));
jest.mock("../models/studentProfile.model", () => ({}));
jest.mock("../models/document.model", () => ({}));
jest.mock("../models/feedback.model", () => ({}));
jest.mock("../models/contactMessage.model", () => ({}));
jest.mock("../models", () => ({}));

const app = require("../app");

describe("App E2E", () => {

  it("GET /", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  it("GET /health", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
  });

});