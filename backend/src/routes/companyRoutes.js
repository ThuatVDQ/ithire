const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const jobController = require("../controllers/jobController");
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

router.put("/update", verifyToken, companyController.updateCompany);

router.get("/my-favorites", verifyToken, jobController.getFavoriteJobs);

module.exports = router;
