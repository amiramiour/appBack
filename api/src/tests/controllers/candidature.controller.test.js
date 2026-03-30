const controller = require("../../controllers/candidature.controller");
const service = require("../../services/candidature.service");

jest.mock("../../services/candidature.service");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Candidature Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // APPLY
  it("apply forbidden", async () => {
    const req = { user: { role: "company" } };
    const res = mockRes();

    await controller.apply(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("apply success", async () => {
    const req = {
      user: { role: "student", id: 1 },
      params: { missionId: 2 }
    };
    const res = mockRes();

    service.applyToMission.mockResolvedValue({ ok: true });

    await controller.apply(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("apply error", async () => {
    const req = {
      user: { role: "student", id: 1 },
      params: { missionId: 2 }
    };
    const res = mockRes();

    service.applyToMission.mockRejectedValue(new Error("fail"));

    await controller.apply(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // STUDENT HISTORY
  it("studentHistory success", async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();

    service.getStudentHistory.mockResolvedValue([]);

    await controller.studentHistory(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("studentHistory error", async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();

    service.getStudentHistory.mockRejectedValue(new Error("fail"));

    await controller.studentHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // MISSION CANDIDATURES
  it("missionCandidatures forbidden", async () => {
    const req = { user: { role: "student" } };
    const res = mockRes();

    await controller.missionCandidatures(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("missionCandidatures success", async () => {
    const req = {
      user: { role: "company", id: 1 },
      params: { missionId: 2 }
    };
    const res = mockRes();

    service.getMissionCandidatures.mockResolvedValue([]);

    await controller.missionCandidatures(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("missionCandidatures error", async () => {
    const req = {
      user: { role: "company", id: 1 },
      params: { missionId: 2 }
    };
    const res = mockRes();

    service.getMissionCandidatures.mockRejectedValue(new Error("fail"));

    await controller.missionCandidatures(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ACCEPT
  it("accept forbidden", async () => {
    const req = { user: { role: "student" } };
    const res = mockRes();

    await controller.accept(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("accept success", async () => {
    const req = {
      user: { role: "company", id: 1 },
      params: { id: 1 }
    };
    const res = mockRes();

    service.acceptCandidature.mockResolvedValue({});

    await controller.accept(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("accept error", async () => {
    const req = {
      user: { role: "company", id: 1 },
      params: { id: 1 }
    };
    const res = mockRes();

    service.acceptCandidature.mockRejectedValue(new Error("fail"));

    await controller.accept(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // REJECT
  it("reject forbidden", async () => {
    const req = { user: { role: "student" } };
    const res = mockRes();

    await controller.reject(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("reject success", async () => {
    const req = {
      user: { role: "company", id: 1 },
      params: { id: 1 }
    };
    const res = mockRes();

    service.rejectCandidature.mockResolvedValue({});

    await controller.reject(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("reject error", async () => {
    const req = {
      user: { role: "company", id: 1 },
      params: { id: 1 }
    };
    const res = mockRes();

    service.rejectCandidature.mockRejectedValue(new Error("fail"));

    await controller.reject(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // CANCEL
  it("cancel success", async () => {
    const req = {
      user: { id: 1 },
      params: { id: 1 }
    };
    const res = mockRes();

    service.cancelCandidature.mockResolvedValue({});

    await controller.cancel(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("cancel error", async () => {
    const req = {
      user: { id: 1 },
      params: { id: 1 }
    };
    const res = mockRes();

    service.cancelCandidature.mockRejectedValue(new Error("fail"));

    await controller.cancel(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // COMPANY CANDIDATURES
  it("companyCandidatures forbidden", async () => {
    const req = { user: { role: "student" } };
    const res = mockRes();

    await controller.companyCandidatures(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("companyCandidatures success", async () => {
    const req = { user: { role: "company", id: 1 } };
    const res = mockRes();

    service.getCompanyCandidatures.mockResolvedValue([]);

    await controller.companyCandidatures(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("companyCandidatures error", async () => {
    const req = { user: { role: "company", id: 1 } };
    const res = mockRes();

    service.getCompanyCandidatures.mockRejectedValue(new Error("fail"));

    await controller.companyCandidatures(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});