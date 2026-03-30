const service = require("../../services/s3.service");
const Document = require("../../models/document.model");

jest.mock("../../models/document.model");

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn().mockResolvedValue("signed-url")
}));

describe("S3 Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getPresignedUrl success", async () => {
    const result = await service.getPresignedUrl(
      { id: 1 },
      "rib"
    );

    expect(result.uploadUrl).toBe("signed-url");
    expect(result.s3Key).toContain("1/");
  });

  it("getPresignedUrl missing type", async () => {
    await expect(service.getPresignedUrl({ id: 1 }))
      .rejects
      .toThrow("Le type de document est requis");
  });

  it("confirmUpload update existing", async () => {
    const existing = {
      save: jest.fn()
    };

    Document.findOne.mockResolvedValue(existing);

    const result = await service.confirmUpload(
      { id: 1 },
      "rib",
      "key"
    );

    expect(existing.save).toHaveBeenCalled();
  });

  it("confirmUpload create new", async () => {
    Document.findOne.mockResolvedValue(null);

    const created = { id: 1 };
    Document.create.mockResolvedValue(created);

    const result = await service.confirmUpload(
      { id: 1 },
      "rib",
      "key"
    );

    expect(result).toEqual(created);
  });

  it("confirmUpload missing key", async () => {
    await expect(service.confirmUpload({ id: 1 }, "rib"))
      .rejects
      .toThrow("S3 key manquante");
  });

});