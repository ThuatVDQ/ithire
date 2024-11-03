const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

// Định nghĩa route để tạo mới vai trò
router.post("/create", roleController.createRole);

module.exports = router;
