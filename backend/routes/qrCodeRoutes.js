const express = require("express");
const router = express.Router();

const { getQRCodeData } = require("../controllers/qrCodeController");

// GET QR code data by student ID
router.get("/student/:id", getQRCodeData);

module.exports = router;
