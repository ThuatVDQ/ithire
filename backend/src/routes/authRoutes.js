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

router.post("/favorite/add/:job_id", verifyToken, authController.addFavoriteJob);

router.delete("/favorite/remove/:job_id", verifyToken, authController.removeFavoriteJob);

router.get("/info", verifyToken, authController.getUserInfo);

router.put("/change-password", verifyToken, authController.changePassword);


module.exports = router;
