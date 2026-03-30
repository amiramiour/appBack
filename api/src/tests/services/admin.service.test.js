const adminService = require("../../services/admin.service");
const { User, Mission, Candidature, StudentProfile } = require("../../models");

// MOCK des models Sequelize
jest.mock("../../models", () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
  Mission: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
  Candidature: {
    findAll: jest.fn(),
  },
  StudentProfile: {
    findAll: jest.fn(),
  },
}));

describe("Admin Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  
  it("getUsers → retourne liste users", async () => {
    const mockUsers = [{ id: 1, email: "test@test.com" }];

    User.findAll.mockResolvedValue(mockUsers);

    const result = await adminService.getUsers();

    expect(User.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });

  
  it("deleteUser → supprime user", async () => {
    const mockUser = {
      role: "student",
      destroy: jest.fn(),
    };

    User.findByPk.mockResolvedValue(mockUser);

    const result = await adminService.deleteUser(1);

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(mockUser.destroy).toHaveBeenCalled();
    expect(result).toEqual({ message: "Utilisateur supprimé" });
  });

  
  it("deleteUser → erreur si user inexistant", async () => {
    User.findByPk.mockResolvedValue(null);

    await expect(adminService.deleteUser(1))
      .rejects
      .toThrow("Utilisateur introuvable");
  });

  
  it("deleteUser → bloque suppression admin", async () => {
    const mockUser = { role: "admin" };

    User.findByPk.mockResolvedValue(mockUser);

    await expect(adminService.deleteUser(1))
      .rejects
      .toThrow("Impossible de supprimer un admin");
  });

 
  it("deleteMission → supprime mission", async () => {
    const mockMission = {
      destroy: jest.fn(),
    };

    Mission.findByPk.mockResolvedValue(mockMission);

    const result = await adminService.deleteMission(1);

    expect(mockMission.destroy).toHaveBeenCalled();
    expect(result).toEqual({ message: "Mission supprimée" });
  });


  it("deleteMission → erreur mission inexistante", async () => {
    Mission.findByPk.mockResolvedValue(null);

    await expect(adminService.deleteMission(1))
      .rejects
      .toThrow("Mission introuvable");
  });

});