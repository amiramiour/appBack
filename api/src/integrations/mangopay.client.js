// Stub d’intégration MangoPay : centralise les appels.
// Remplace/complète avec le SDK officiel si tu veux (mangopay2-nodejs-sdk)
// ou garde axios avec Basic Auth (client_id:api_key)

const axios = require("axios");

const baseURL = process.env.MANGOPAY_BASE_URL || "https://api.mangopay.com";
const clientId = process.env.MANGOPAY_CLIENT_ID || "";
const apiKey   = process.env.MANGOPAY_API_KEY || "";

// Client Axios avec Basic Auth
const mgp = axios.create({
  baseURL: `${baseURL}/v2.01/${clientId}`,
  auth: { username: clientId, password: apiKey },
});

// Mappe nos types locaux -> types KYC MangoPay si nécessaire
function mapDocTypeToMangoPay(docType) {
  // Exemple: photo_identite -> IDENTITY_PROOF
  switch (docType) {
    case "photo_identite": return "IDENTITY_PROOF";
    case "titre_sejour": return "RESIDENCY_PROOF";
    case "justificatif_domicile": return "ADDRESS_PROOF";
    case "rib": return "BANK_ACCOUNT_DETAILS"; // selon besoins
    default: return "IDENTITY_PROOF";
  }
}

module.exports = {
  async createKycDocument(mgpUserId, docType) {
    const Type = mapDocTypeToMangoPay(docType);
    const { data } = await mgp.post(`/users/${mgpUserId}/kyc/documents`, { Type });
    return data; // { Id, Status, Type, ... }
  },

  async uploadKycPage(mgpUserId, mgpDocumentId, fileBuffer) {
    // Envoi page binaire (multipart form-data)
    // MangoPay attend du base64. On simplifie ici :
    const page = fileBuffer.toString("base64");
    const { data } = await mgp.post(
      `/users/${mgpUserId}/kyc/documents/${mgpDocumentId}/pages`,
      { File: page }
    );
    return data;
  },

  async submitKycDocument(mgpUserId, mgpDocumentId) {
    const { data } = await mgp.put(
      `/users/${mgpUserId}/kyc/documents/${mgpDocumentId}`,
      { Status: "VALIDATION_ASKED" }
    );
    return data; // Status devrait passer à VALIDATION_ASKED
  },
};
