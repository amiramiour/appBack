const controller = require("../../controllers/mission.controller");
const missionService = require("../../services/mission.service");

jest.mock("../../services/mission.service");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const NodeCache = require("node-cache");

jest.mock("node-cache");

jest.spyOn(console, "error").mockImplementation(() => {});
describe("Mission Controller", () => {

  beforeEach(() => {
  jest.clearAllMocks();

  NodeCache.mockImplementation(() => ({
    get: jest.fn().mockReturnValue(null),
    set: jest.fn(),
    del: jest.fn()
  }));
});

  // CREATE
  it("create forbidden", async () => {
    const req = { user: { role: "student" } };
    const res = mockRes();

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("create success", async () => {
    const req = {
      user: { role: "company", id: 1 },
      body: {}
    };
    const res = mockRes();

    missionService.createMission.mockResolvedValue({ id: 1 });

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("create error", async () => {
    const req = {
      user: { role: "company", id: 1 },
      body: {}
    };
    const res = mockRes();

    missionService.createMission.mockRejectedValue(new Error("fail"));

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // LIST
  
  it("list from db", async () => {
    const req = {};
    const res = mockRes();

    const mockMission = {
      get: jest.fn().mockReturnValue({ id: 1 })
    };

    missionService.getAllMissions.mockResolvedValue([mockMission]);

    await controller.list(req, res);

    expect(res.json).toHaveBeenCalledWith({
      source: "db",
      data: [{ id: 1 }]
    });
  });

it("list from cache", async () => {
  const req = {};
  const res = mockRes();

  let cacheStore = {};

  jest.resetModules();

  jest.doMock("node-cache", () => {
    return jest.fn().mockImplementation(() => ({
      get: (key) => cacheStore[key],
      set: (key, value) => {
        cacheStore[key] = value;
      },
      del: jest.fn()
    }));
  });

  jest.doMock("../../services/mission.service", () => ({
    getAllMissions: jest.fn()
  }));

  const missionServiceFresh = require("../../services/mission.service");
  const controllerFresh = require("../../controllers/mission.controller");

  const mockMission = {
    get: jest.fn().mockReturnValue({ id: 1 })
  };

  missionServiceFresh.getAllMissions.mockResolvedValue([mockMission]);

  await controllerFresh.list(req, res);

  const res2 = mockRes();
  await controllerFresh.list(req, res2);

  expect(res2.json).toHaveBeenCalledWith({
    source: "cache",
    data: [{ id: 1 }]
  });
});

  it("list error", async () => {
    const req = {};
    const res = mockRes();

    missionService.getAllMissions.mockRejectedValue(new Error("fail"));

    await controller.list(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // MY MISSIONS
  it("myMissions success", async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();

    missionService.getMyMissions.mockResolvedValue([]);

    await controller.myMissions(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("myMissions error", async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();

    missionService.getMyMissions.mockRejectedValue(new Error("fail"));

    await controller.myMissions(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // DELETE
  it("delete success", async () => {
    const req = {
      params: { id: 1 },
      user: { id: 1 }
    };
    const res = mockRes();

    missionService.deleteMission.mockResolvedValue({ ok: true });

    await controller.delete(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("delete error", async () => {
    const req = {
      params: { id: 1 },
      user: { id: 1 }
    };
    const res = mockRes();

    missionService.deleteMission.mockRejectedValue(new Error("fail"));

    await controller.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // GET BY ID
  it("getById success", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    const mockMission = {
      get: jest.fn().mockReturnValue({ id: 1 })
    };

    missionService.getMissionById.mockResolvedValue(mockMission);

    await controller.getById(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });

  it("getById not found", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    missionService.getMissionById.mockResolvedValue(null);

    await controller.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("getById error", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    missionService.getMissionById.mockRejectedValue(new Error("fail"));

    await controller.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});