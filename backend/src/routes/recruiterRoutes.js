const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const jobController = require("../controllers/jobController");
const verifyToken = require("../middleware/authMiddleware");


router.get("/company", verifyToken, companyController.getCompanyByUser);

router.put("/", verifyToken, companyController.updateCompany);

router.get("/dashboard", verifyToken, companyController.dashboard);

router.get("/jobs", verifyToken, jobController.getJobsByCompany);

router.get("/search", verifyToken, jobController.searchJobsForRecruiter);

module.exports = router;
