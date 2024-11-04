const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const {
  validateCompanyCreation,
} = require("../middleware/validationMiddleware");
const verifyToken = require("../middleware/authMiddleware");

router.post(
  "/create",
  verifyToken,
  validateCompanyCreation,
  companyController.createCompany
);

module.exports = router;