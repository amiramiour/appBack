const controller = require("../../controllers/feedback.controller");
const feedbackService = require("../../services/feedback.service");
const emailService = require("../../services/resendEmail.service");

jest.mock("../../services/feedback.service");
jest.mock("../../services/resendEmail.service");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Feedback Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createFeedback success", async () => {
    const req = { body: { message: "ok" } };
    const res = mockRes();

    const mockFeedback = { id: 1 };

    feedbackService.createFeedback.mockResolvedValue(mockFeedback);
    emailService.sendFeedbackNotification.mockResolvedValue();

    await controller.createFeedback(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Merci pour votre avis !",
      data: mockFeedback
    });
  });

  it("createFeedback error", async () => {
    const req = { body: {} };
    const res = mockRes();

    feedbackService.createFeedback.mockRejectedValue(new Error("fail"));

    await controller.createFeedback(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getAllFeedbacks success", async () => {
    const req = {};
    const res = mockRes();

    feedbackService.getAllFeedbacks.mockResolvedValue([]);

    await controller.getAllFeedbacks(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("getAllFeedbacks error", async () => {
    const req = {};
    const res = mockRes();

    feedbackService.getAllFeedbacks.mockRejectedValue(new Error("fail"));

    await controller.getAllFeedbacks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});