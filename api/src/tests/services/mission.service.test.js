const missionService = require("../../services/mission.service");
const Mission = require("../../models/mission.model");
const User = require("../../models/user.model");

jest.mock("../../models/mission.model");
jest.mock("../../models/user.model");

describe("Mission Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createMission", async () => {
    const mockMission = { id: 1 };

    Mission.create.mockResolvedValue(mockMission);

    const data = {
      intitule: "Test",
      type: "stage",
      description: "desc",
      niveau: "bac+3",
      lieu: "Paris",
      dateDebut: "2025-01-01",
      duree: 10,
      remuneration: 100,
      conditions: true
    };

    const result = await missionService.createMission(data, 1);

    expect(Mission.create).toHaveBeenCalled();
    expect(result).toEqual(mockMission);
  });

  it("getAllMissions", async () => {
    const mockMissions = [{ id: 1 }];

    Mission.findAll.mockResolvedValue(mockMissions);

    const result = await missionService.getAllMissions();

    expect(Mission.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockMissions);
  });

  it("getMyMissions", async () => {
    const mockMissions = [{ id: 2 }];

    Mission.findAll.mockResolvedValue(mockMissions);

    const result = await missionService.getMyMissions(1);

    expect(Mission.findAll).toHaveBeenCalledWith({ where: { employerId: 1 } });
    expect(result).toEqual(mockMissions);
  });

  it("deleteMission success", async () => {
    const mockMission = {
      destroy: jest.fn()
    };

    Mission.findOne.mockResolvedValue(mockMission);

    const result = await missionService.deleteMission(1, 1);

    expect(mockMission.destroy).toHaveBeenCalled();
    expect(result).toEqual({ message: "Mission supprimée avec succès" });
  });

  it("deleteMission error", async () => {
    Mission.findOne.mockResolvedValue(null);

    await expect(missionService.deleteMission(1, 1))
      .rejects
      .toThrow("Mission introuvable ou non autorisée");
  });

  it("getMissionById", async () => {
    const mockMission = { id: 1 };

    Mission.findByPk.mockResolvedValue(mockMission);

    const result = await missionService.getMissionById(1);

    expect(Mission.findByPk).toHaveBeenCalled();
    expect(result).toEqual(mockMission);
  });

});