const express = require("express");
const router = express.Router();
const cvController = require("../controllers/cvController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/downloadCV/:cv_id", verifyToken, cvController.downloadCV);
router.get("/viewCV/:filename", verifyToken, cvController.viewCV);
module.exports = router;
