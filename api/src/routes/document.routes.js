const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/document.controller");

const router = express.Router();

router.get("/presigned-url", requireAuth, controller.getPresignedUrl);
router.post("/confirm", requireAuth, controller.confirmUpload);
router.get("/my", requireAuth, controller.myDocuments);
router.get("/kyc-status", requireAuth, controller.kycStatus);
router.patch("/:id/status", requireAuth, controller.updateStatus);

module.exports = router;
