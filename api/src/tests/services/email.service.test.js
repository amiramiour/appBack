const mockSend = jest.fn();

jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: mockSend
    }
  }))
}));

const service = require("../../services/email.service");

describe("Email Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });
  it("sendPasswordResetEmail success", async () => {
    mockSend.mockResolvedValue({ success: true });

    const result = await service.sendPasswordResetEmail(
      "test@test.com",
      "http://reset-link"
    );

    expect(result).toEqual({ success: true });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@test.com"
      })
    );
  });

  it("sendPasswordResetEmail failure", async () => {
    mockSend.mockRejectedValue(new Error("fail"));

    await expect(
      service.sendPasswordResetEmail("test@test.com", "link")
    ).rejects.toThrow("Échec de l’envoi de l’email de réinitialisation");
  });

});