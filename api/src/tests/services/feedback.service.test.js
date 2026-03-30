const service = require("../../services/feedback.service");
const Feedback = require("../../models/feedback.model");

jest.mock("../../models/feedback.model");

describe("Feedback Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createFeedback success", async () => {
    const mock = { id: 1 };

    Feedback.create.mockResolvedValue(mock);

    const result = await service.createFeedback({
      nom: "a",
      prenom: "b",
      email: "test@test.com",
      message: "hello",
      note: 5,
      tags: ["ui"]
    });

    expect(result).toEqual(mock);
  });

  it("missing fields", async () => {
    await expect(service.createFeedback({}))
      .rejects
      .toThrow("Champs requis manquants");
  });

  it("invalid email", async () => {
    await expect(service.createFeedback({
      nom: "a",
      prenom: "b",
      email: "bad",
      message: "x",
      note: 5
    })).rejects.toThrow("Email invalide");
  });

  it("invalid note", async () => {
    await expect(service.createFeedback({
      nom: "a",
      prenom: "b",
      email: "test@test.com",
      message: "x",
      note: 10
    })).rejects.toThrow("Note invalide");
  });

  it("getAllFeedbacks", async () => {
    Feedback.findAll.mockResolvedValue([]);

    const result = await service.getAllFeedbacks();

    expect(result).toEqual([]);
    expect(Feedback.findAll).toHaveBeenCalled();
  });

});