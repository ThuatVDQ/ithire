const express = require("express");
const router = express.Router();
const favoriteJobController = require("../controllers/favoriteJobController");
const verifyToken = require("../middleware/authMiddleware");

// Route để thêm công việc vào danh sách yêu thích
router.post("/add/:job_id", verifyToken, favoriteJobController.addFavoriteJob);

// Route để xóa công việc khỏi danh sách yêu thích
router.delete("/remove/:job_id", verifyToken, favoriteJobController.removeFavoriteJob);

module.exports = router;
