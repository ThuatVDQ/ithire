const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateSignup } = require("../middleware/validationMiddleware");

router.post("/signup", validateSignup, authController.signup);

module.exports = router;
