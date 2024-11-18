const express = require("express");
const router = express.Router();
const jobApplicationController = require("../controllers/jobApplicationController");
const verifyToken = require("../middleware/authMiddleware");

router.get(
  "/downloadCV/:job_id",
  verifyToken,
  jobApplicationController.downloadCV
);

router.get(
  "/:job_id",
  verifyToken,
  jobApplicationController.getJobApplicationsByJobId
);

router.put(
  "/change-status/:job_application_id/",
  verifyToken,
  jobApplicationController.changeApplicationStatus
);

router.get(
  "/:job_id/check-application",
  verifyToken,
  jobApplicationController.checkJobApplication
);
module.exports = router;
