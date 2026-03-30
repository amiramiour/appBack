const controller = require("../../controllers/document.controller");
const s3Service = require("../../services/s3.service");
const documentService = require("../../services/document.service");
const Document = require("../../models/document.model");

jest.mock("../../services/s3.service");
jest.mock("../../services/document.service");
jest.mock("../../models/document.model");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Document Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  // ===== PRESIGNED URL =====
  it("getPresignedUrl success", async () => {
    const req = { user: { id: 1 }, query: { type: "rib" } };
    const res = mockRes();

    s3Service.getPresignedUrl.mockResolvedValue({ url: "ok" });

    await controller.getPresignedUrl(req, res);

    expect(res.json).toHaveBeenCalledWith({ url: "ok" });
  });

  it("getPresignedUrl error", async () => {
    const req = { user: { id: 1 }, query: { type: "rib" } };
    const res = mockRes();

    s3Service.getPresignedUrl.mockRejectedValue(new Error("fail"));

    await controller.getPresignedUrl(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ===== CONFIRM UPLOAD =====
  it("confirmUpload success", async () => {
    const req = {
      user: { id: 1 },
      body: { type: "rib", s3Key: "key" }
    };
    const res = mockRes();

    s3Service.confirmUpload.mockResolvedValue({ id: 1 });

    await controller.confirmUpload(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("confirmUpload error", async () => {
    const req = {
      user: { id: 1 },
      body: {}
    };
    const res = mockRes();

    s3Service.confirmUpload.mockRejectedValue(new Error("fail"));

    await controller.confirmUpload(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ===== MY DOCUMENTS =====
  it("myDocuments success", async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();

    documentService.getUserDocuments.mockResolvedValue([]);

    await controller.myDocuments(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("myDocuments error", async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();

    documentService.getUserDocuments.mockRejectedValue(new Error("fail"));

    await controller.myDocuments(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ===== KYC STATUS =====
  it("kycStatus success", async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();

    documentService.getGlobalKycStatus.mockResolvedValue({ ok: true });

    await controller.kycStatus(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("kycStatus error", async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();

    documentService.getGlobalKycStatus.mockRejectedValue(new Error("fail"));

    await controller.kycStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ===== UPDATE STATUS =====
  it("updateStatus success", async () => {
    const req = {
      params: { id: 1 },
      body: { status: "VALIDATED", comment: "ok" }
    };
    const res = mockRes();

    documentService.updateDocumentStatus.mockResolvedValue({ id: 1 });

    await controller.updateStatus(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it("updateStatus error", async () => {
    const req = {
      params: { id: 1 },
      body: {}
    };
    const res = mockRes();

    documentService.updateDocumentStatus.mockRejectedValue(new Error("fail"));

    await controller.updateStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ===== SUBMIT DOSSIER =====

  it("submitDossier missing docs", async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();

    Document.findAll.mockResolvedValue([]);

    await controller.submitDossier(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("submitDossier already validated", async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();

    const docs = Array(7).fill({
      docType: "rib",
      fileUrl: "ok",
      kycStatus: "VALIDATED"
    });

    Document.findAll.mockResolvedValue(docs);

    await controller.submitDossier(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("submitDossier success first submit", async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();

    const docs = [
      { docType: "rib", fileUrl: "ok", kycStatus: "CREATED" },
      { docType: "photo_identite", fileUrl: "ok", kycStatus: "CREATED" },
      { docType: "titre_sejour", fileUrl: "ok", kycStatus: "CREATED" },
      { docType: "certificat_scolarite", fileUrl: "ok", kycStatus: "CREATED" },
      { docType: "diplome", fileUrl: "ok", kycStatus: "CREATED" },
      { docType: "justificatif_domicile", fileUrl: "ok", kycStatus: "CREATED" },
      { docType: "charte_engagement", fileUrl: "ok", kycStatus: "CREATED" }
    ];

    Document.findAll.mockResolvedValue(docs);
    Document.update.mockResolvedValue();

    await controller.submitDossier(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("submitDossier error", async () => {
    const req = { user: { id: 1 } };
    const res = mockRes();

    Document.findAll.mockRejectedValue(new Error("fail"));

    await controller.submitDossier(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

});