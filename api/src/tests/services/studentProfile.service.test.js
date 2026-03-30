const service = require("../../services/studentProfile.service");
const StudentProfile = require("../../models/studentProfile.model");

jest.mock("../../models/studentProfile.model");

describe("StudentProfile Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getOrCreateProfile success", async () => {
    const mockProfile = {
      missions_recherchees: JSON.stringify(["dev"]),
      disponibilites: JSON.stringify(["weekend"]),
    };

    StudentProfile.findOrCreate.mockResolvedValue([mockProfile]);

    const result = await service.getOrCreateProfile(1);

    expect(result.missions_recherchees).toEqual(["dev"]);
    expect(result.disponibilites).toEqual(["weekend"]);
  });

  it("updateProfile success", async () => {
    const mockProfile = {
      update: jest.fn(),
    };

    StudentProfile.findOne.mockResolvedValue(mockProfile);

    const data = {
      localisation: "Paris",
      langues_parlees: "FR",
      competences: "JS",
      disponibilites: ["weekend"],
      nationalites: "FR",
      missions_recherchees: ["dev"]
    };

    const result = await service.updateProfile(1, data);

    expect(mockProfile.update).toHaveBeenCalled();
    expect(result).toBe(mockProfile);
  });

  it("updateProfile not found", async () => {
    StudentProfile.findOne.mockResolvedValue(null);

    await expect(service.updateProfile(1, {}))
      .rejects
      .toThrow("Profil étudiant introuvable");
  });

});