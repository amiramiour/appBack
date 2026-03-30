const service = require("../../services/candidature.service");
const Candidature = require("../../models/candidature.model");
const Mission = require("../../models/mission.model");
const User = require("../../models/user.model");
const emailService = require("../../services/resendEmail.service");

jest.mock("../../models/candidature.model");
jest.mock("../../models/mission.model");
jest.mock("../../models/user.model");
jest.mock("../../services/resendEmail.service");

describe("Candidature Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applyToMission already accepted", async () => {
    Candidature.findOne.mockResolvedValue({ status: "accepted" });

    await expect(service.applyToMission(1, 1))
      .rejects
      .toThrow("Vous avez déjà une mission en cours");
  });

  it("applyToMission mission not found", async () => {
    Candidature.findOne.mockResolvedValue(null);
    Mission.findByPk.mockResolvedValue(null);

    await expect(service.applyToMission(1, 1))
      .rejects
      .toThrow("Mission introuvable");
  });

  it("applyToMission mission inactive", async () => {
    Candidature.findOne.mockResolvedValue(null);
    Mission.findByPk.mockResolvedValue({ status: "closed" });

    await expect(service.applyToMission(1, 1))
      .rejects
      .toThrow("Cette mission n'est plus disponible");
  });

  it("applyToMission new candidature", async () => {
    Candidature.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    Mission.findByPk.mockResolvedValue({ status: "active" });

    const mockCreate = { id: 1 };
    Candidature.create.mockResolvedValue(mockCreate);

    const result = await service.applyToMission(1, 1);

    expect(result).toEqual(mockCreate);
  });

  it("acceptCandidature success", async () => {
    const mockMission = {
      employerId: 1,
      status: "active",
      save: jest.fn()
    };

    const mockCandidature = {
      id: 1,
      studentId: 2,
      missionId: 1,
      status: "under_review",
      mission: mockMission,
      save: jest.fn()
    };

    Candidature.findByPk.mockResolvedValue(mockCandidature);
    Candidature.update.mockResolvedValue();
    Candidature.findAll.mockResolvedValue([]);

    User.findByPk.mockResolvedValue({
      email: "test@test.com",
      firstName: "test"
    });

    const result = await service.acceptCandidature(1, 1);

    expect(result.status).toBe("accepted");
  });

  it("rejectCandidature success", async () => {
    const mockCandidature = {
      status: "under_review",
      mission: { employerId: 1 },
      save: jest.fn()
    };

    Candidature.findByPk.mockResolvedValue(mockCandidature);

    const result = await service.rejectCandidature(1, 1);

    expect(result.status).toBe("rejected");
  });

  it("cancelCandidature success", async () => {
    const mockCandidature = {
      studentId: 1,
      status: "under_review",
      save: jest.fn()
    };

    Candidature.findByPk.mockResolvedValue(mockCandidature);

    const result = await service.cancelCandidature(1, 1);

    expect(result.status).toBe("cancelled");
  });

  it("cancelCandidature forbidden", async () => {
    const mockCandidature = {
      studentId: 2,
      status: "under_review"
    };

    Candidature.findByPk.mockResolvedValue(mockCandidature);

    await expect(service.cancelCandidature(1, 1))
      .rejects
      .toThrow("Action interdite");
  });

  it("applyToMission reapply after rejected", async () => {
  const mockCandidature = {
    status: "rejected",
    save: jest.fn().mockResolvedValue("updated")
  };

  Candidature.findOne
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce(mockCandidature);

  Mission.findByPk.mockResolvedValue({ status: "active" });

  const result = await service.applyToMission(1, 1);

  expect(result).toBe("updated");
});

it("applyToMission already active candidature", async () => {
  Candidature.findOne
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce({ status: "under_review" });

  Mission.findByPk.mockResolvedValue({ status: "active" });

  await expect(service.applyToMission(1, 1))
    .rejects
    .toThrow("Vous avez déjà une candidature active pour cette mission");
});

it("acceptCandidature not found", async () => {
  Candidature.findByPk.mockResolvedValue(null);

  await expect(service.acceptCandidature(1, 1))
    .rejects
    .toThrow("Candidature introuvable");
});

it("acceptCandidature already treated", async () => {
  Candidature.findByPk.mockResolvedValue({
    status: "accepted"
  });

  await expect(service.acceptCandidature(1, 1))
    .rejects
    .toThrow("Candidature déjà traitée");
});

it("acceptCandidature wrong employer", async () => {
  const mock = {
    status: "under_review",
    mission: { employerId: 2 }
  };

  Candidature.findByPk.mockResolvedValue(mock);

  await expect(service.acceptCandidature(1, 1))
    .rejects
    .toThrow("Accès interdit");
});

it("acceptCandidature mission already processed", async () => {
  const mock = {
    status: "under_review",
    mission: { employerId: 1, status: "archivee" }
  };

  Candidature.findByPk.mockResolvedValue(mock);

  await expect(service.acceptCandidature(1, 1))
    .rejects
    .toThrow("Mission déjà traitée");
});

it("rejectCandidature not found", async () => {
  Candidature.findByPk.mockResolvedValue(null);

  await expect(service.rejectCandidature(1, 1))
    .rejects
    .toThrow("Candidature introuvable");
});

it("rejectCandidature already treated", async () => {
  Candidature.findByPk.mockResolvedValue({
    status: "accepted"
  });

  await expect(service.rejectCandidature(1, 1))
    .rejects
    .toThrow("Candidature déjà traitée");
});

it("rejectCandidature forbidden", async () => {
  Candidature.findByPk.mockResolvedValue({
    status: "under_review",
    mission: { employerId: 2 }
  });

  await expect(service.rejectCandidature(1, 1))
    .rejects
    .toThrow("Accès interdit");
});

it("cancelCandidature not found", async () => {
  Candidature.findByPk.mockResolvedValue(null);

  await expect(service.cancelCandidature(1, 1))
    .rejects
    .toThrow("Candidature introuvable");
});

it("cancelCandidature already processed", async () => {
  Candidature.findByPk.mockResolvedValue({
    studentId: 1,
    status: "accepted"
  });

  await expect(service.cancelCandidature(1, 1))
    .rejects
    .toThrow("Impossible d’annuler une candidature traitée");
});

it("getMissionCandidatures success", async () => {
  Mission.findByPk.mockResolvedValue({
    employerId: 1
  });

  Candidature.findAll.mockResolvedValue([]);

  const result = await service.getMissionCandidatures(1, 1);

  expect(result).toEqual([]);
});

it("getMissionCandidatures not found", async () => {
  Mission.findByPk.mockResolvedValue(null);

  await expect(service.getMissionCandidatures(1, 1))
    .rejects
    .toThrow("Mission introuvable");
});

it("getMissionCandidatures forbidden", async () => {
  Mission.findByPk.mockResolvedValue({
    employerId: 2
  });

  await expect(service.getMissionCandidatures(1, 1))
    .rejects
    .toThrow("Accès interdit à cette mission");
});

it("getCompanyCandidatures", async () => {
  Candidature.findAll.mockResolvedValue([]);

  const result = await service.getCompanyCandidatures(1);

  expect(result).toEqual([]);
});
});