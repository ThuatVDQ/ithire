const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/create", verifyToken, jobController.createJob);

router.get("/detail/:job_id", jobController.getJobDetail);

router.get("/company", verifyToken, jobController.getJobsByCompany);

router.get("/:status", jobController.getJobsByStatus);

module.exports = router;
