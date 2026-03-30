const service = require("../../services/document.service");
const Document = require("../../models/document.model");

jest.mock("../../models/document.model");

describe("Document Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getUserDocuments", async () => {
    const mockDocs = [{ id: 1 }];

    Document.findAll.mockResolvedValue(mockDocs);

    const result = await service.getUserDocuments(1);

    expect(result).toEqual(mockDocs);
  });

  it("getGlobalKycStatus validated", async () => {
    const docs = [
      { docType: "photo_identite", kycStatus: "VALIDATED", sentAt: "2024-01-01" },
      { docType: "titre_sejour", kycStatus: "VALIDATED", sentAt: "2024-01-02" },
      { docType: "certificat_scolarite", kycStatus: "VALIDATED", sentAt: "2024-01-03" },
      { docType: "diplome", kycStatus: "VALIDATED", sentAt: "2024-01-04" },
      { docType: "rib", kycStatus: "VALIDATED", sentAt: "2024-01-05" },
      { docType: "justificatif_domicile", kycStatus: "VALIDATED", sentAt: "2024-01-06" },
      { docType: "charte_engagement", kycStatus: "VALIDATED", sentAt: "2024-01-07" },
    ];

    Document.findAll.mockResolvedValue(docs);

    const result = await service.getGlobalKycStatus(1);

    expect(result.validated).toBe(true);
    expect(result.deposited).toBe(true);
  });

  it("getGlobalKycStatus refused", async () => {
    const docs = [
      { docType: "photo_identite", kycStatus: "REFUSED" },
      { docType: "titre_sejour", kycStatus: "REFUSED" },
      { docType: "certificat_scolarite", kycStatus: "REFUSED" },
      { docType: "diplome", kycStatus: "REFUSED" },
      { docType: "rib", kycStatus: "REFUSED" },
      { docType: "justificatif_domicile", kycStatus: "REFUSED" },
      { docType: "charte_engagement", kycStatus: "REFUSED" },
    ];

    Document.findAll.mockResolvedValue(docs);

    const result = await service.getGlobalKycStatus(1);

    expect(result.refused).toBe(true);
  });

  it("updateDocumentStatus success", async () => {
    const mockDoc = {
      userId: 1,
      kycStatus: null,
      reviewStartedAt: null,
      save: jest.fn()
    };

    Document.findByPk.mockResolvedValue(mockDoc);
    Document.findAll.mockResolvedValue([{ kycStatus: "VALIDATED" }]);
    Document.update.mockResolvedValue();

    const result = await service.updateDocumentStatus(1, "VALIDATED");

    expect(mockDoc.kycStatus).toBe("VALIDATED");
    expect(mockDoc.save).toHaveBeenCalled();
    expect(result).toBe(mockDoc);
  });

  it("updateDocumentStatus not found", async () => {
    Document.findByPk.mockResolvedValue(null);

    await expect(service.updateDocumentStatus(1, "VALIDATED"))
      .rejects
      .toThrow("Document introuvable");
  });

});