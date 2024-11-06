const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const notificationController = require("../controllers/notificationController");

router.post("/" ,  notificationController.createNotification)

module.exports = router;