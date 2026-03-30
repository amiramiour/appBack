const service = require("../../services/contact.service");
const ContactMessage = require("../../models/contactMessage.model");

jest.mock("../../models/contactMessage.model");

describe("Contact Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createMessage success", async () => {
    const mock = { id: 1 };

    ContactMessage.create.mockResolvedValue(mock);

    const result = await service.createMessage({
      nom: "a",
      prenom: "b",
      email: "test@test.com",
      message: "hello"
    });

    expect(result).toEqual(mock);
  });

  it("createMessage missing fields", async () => {
    await expect(service.createMessage({}))
      .rejects
      .toThrow("Tous les champs sont requis");
  });

  it("createMessage invalid email", async () => {
    await expect(service.createMessage({
      nom: "a",
      prenom: "b",
      email: "bad",
      message: "test"
    })).rejects.toThrow("Email invalide");
  });

});