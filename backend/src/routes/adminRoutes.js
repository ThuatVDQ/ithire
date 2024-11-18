const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const jobController = require("../controllers/jobController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/dashboard", verifyToken, authController.dashboard);

router.get("/jobs/search", verifyToken, jobController.searchJobsForAdmin);

router.get("/jobs", verifyToken, jobController.getAllForAdmin);

router.get("/users", verifyToken, authController.getAllUsers);

router.put("/users/:user_id", verifyToken, authController.blockUser);

router.get("/jobs/:status", verifyToken,jobController.getJobsByStatus);

router.post("/jobs/approve/:job_id", verifyToken, jobController.approveJob);

router.post("/jobs/reject/:job_id", verifyToken, jobController.rejectJob);

router.put("/jobs/close/:job_id", verifyToken, jobController.closeJob);

module.exports = router;
