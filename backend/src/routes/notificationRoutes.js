const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const verifyToken = require("../middleware/authMiddleware");
console.log(notificationController);

// Route để lấy thông báo cho người dùng
router.get("/", verifyToken, notificationController.getNotificationsForUser);

// Route để đếm số lượng thông báo chưa đọc
router.get("/unread-count", verifyToken, notificationController.getUnreadNotificationCount);

// Route để đánh dấu một thông báo là đã đọc
router.put("/:notificationId/read", verifyToken, notificationController.markNotificationAsRead);

// Route để tạo thông báo (chỉ cho phép từ backend hoặc các yêu cầu quản trị)
router.post("/", notificationController.createNotification);

module.exports = router;
