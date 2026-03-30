const service = require("../../services/resendEmail.service");

jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ success: true })
    }
  }))
}));

describe("Resend Email Service", () => {

  it("sendContactNotification", async () => {
    const result = await service.sendContactNotification({
      nom: "a",
      prenom: "b",
      email: "test@test.com",
      message: "hello"
    });

    expect(result).toBeDefined();
  });

  it("sendContactConfirmation", async () => {
    const result = await service.sendContactConfirmation({
      prenom: "a",
      email: "test@test.com",
      message: "hello"
    });

    expect(result).toBeDefined();
  });

  it("sendFeedbackNotification", async () => {
    const result = await service.sendFeedbackNotification({
      nom: "a",
      prenom: "b",
      email: "test@test.com",
      note: 5,
      message: "ok"
    });

    expect(result).toBeDefined();
  });

  it("sendCandidatureAccepted", async () => {
    const result = await service.sendCandidatureAccepted(
      "test@test.com",
      "a",
      "mission"
    );

    expect(result).toBeDefined();
  });

  it("sendCandidatureRejected", async () => {
    const result = await service.sendCandidatureRejected(
      "test@test.com",
      "a",
      "mission"
    );

    expect(result).toBeDefined();
  });

});