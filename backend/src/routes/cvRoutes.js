const express = require("express");
const router = express.Router();
const cvController = require("../controllers/cvController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/:cv_id/downloadCV", verifyToken, cvController.downloadCV);

module.exports = router;
