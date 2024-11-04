const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateSignup } = require("../middleware/validationMiddleware");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/signup", validateSignup, authController.signup);

router.post("/login", authController.login);

router.put("/update", verifyToken, authController.updateUser);
module.exports = router;
