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

router.get("/detail/:company_id", companyController.getCompanyDetail);

router.get("/", companyController.getAll)

router.get("/info", verifyToken, companyController.getCompanyByUser);

module.exports = router;
