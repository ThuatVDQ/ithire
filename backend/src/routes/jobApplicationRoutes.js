const express = require("express");
const router = express.Router();
const jobApplicationController = require("../controllers/jobApplicationController");
const verifyToken = require("../middleware/authMiddleware");

router.get(
  "/:job_id/downloadCV",
  verifyToken,
  jobApplicationController.downloadCV
);

router.get(
  "/:job_id",
  jobApplicationController.getJobApplicationsByJobId
);

module.exports = router;
