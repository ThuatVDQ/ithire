const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateSignup } = require("../middleware/validationMiddleware");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { validateAvatarFileType } = require("../middleware/validationMiddleware");

router.post("/signup", validateSignup, authController.signup);

router.post("/login", authController.login);

router.put("/update", verifyToken, authController.updateUser);

router.post("/upload-avatar", verifyToken, upload.single("avatar"), validateAvatarFileType, authController.uploadAvatar);

module.exports = router;
