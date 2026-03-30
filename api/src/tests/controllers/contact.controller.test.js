const controller = require("../../controllers/contact.controller");
const contactService = require("../../services/contact.service");
const emailService = require("../../services/resendEmail.service");

jest.mock("../../services/contact.service");
jest.mock("../../services/resendEmail.service");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Contact Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createContactMessage success", async () => {
    const req = {
      body: {
        nom: "test",
        prenom: "test",
        email: "test@test.com",
        message: "hello"
      }
    };
    const res = mockRes();

    const mockMessage = { id: 1 };

    contactService.createMessage.mockResolvedValue(mockMessage);
    emailService.sendContactNotification.mockResolvedValue();
    emailService.sendContactConfirmation.mockResolvedValue();

    await controller.createContactMessage(req, res);

    expect(contactService.createMessage).toHaveBeenCalledWith(req.body);
    expect(emailService.sendContactNotification).toHaveBeenCalledWith(req.body);
    expect(emailService.sendContactConfirmation).toHaveBeenCalledWith(req.body);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Message envoyé avec succès",
      data: mockMessage,
    });
  });

  it("createContactMessage error from service", async () => {
    const req = { body: {} };
    const res = mockRes();

    contactService.createMessage.mockRejectedValue(new Error("fail"));

    await controller.createContactMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("createContactMessage error from email notification", async () => {
    const req = { body: { email: "test@test.com" } };
    const res = mockRes();

    contactService.createMessage.mockResolvedValue({ id: 1 });
    emailService.sendContactNotification.mockRejectedValue(new Error("fail"));

    await controller.createContactMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("createContactMessage error from email confirmation", async () => {
    const req = { body: { email: "test@test.com" } };
    const res = mockRes();

    contactService.createMessage.mockResolvedValue({ id: 1 });
    emailService.sendContactNotification.mockResolvedValue();
    emailService.sendContactConfirmation.mockRejectedValue(new Error("fail"));

    await controller.createContactMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});