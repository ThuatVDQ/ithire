const Notification = require("../models/Notification");
const User = require("../models/User");
const { getSocket } = require("../configs/socket"); // Lấy socket instance từ cấu hình socket.js

// Hàm tạo thông báo mới
exports.createNotification = async (user_id, message) => {
  try {
    // Tạo thông báo mới và lưu vào cơ sở dữ liệu
    const notification = new Notification({
      message,
      user_id,
      send_at: new Date(),
    });

    await notification.save();

    // Lấy socket.io instance từ file socket.js
    const socket = getSocket();  // Lấy socket instance từ cấu hình socket.js

    if (socket) {
      // Phát thông báo mới tới tất cả các client đang kết nối
      socket.emit("new_notification", { user_id, message });
    }
  } catch (error) {
    console.error("Lỗi khi tạo thông báo:", error);
  }
};

// Hàm lấy thông báo cho người dùng cụ thể
exports.getNotificationsForUser = async (req, res) => {
  try {
    const userEmail = req.user.email; // Lấy email từ token đã xác thực

    // Tìm `user_id` từ `email`
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notifications = await Notification.find({ user_id: user.user_id })
      .sort({ send_at: -1 }) // Sắp xếp từ mới đến cũ
      .limit(10); // Lấy 10 thông báo gần nhất

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Hàm đếm số lượng thông báo chưa đọc cho người dùng
exports.getUnreadNotificationCount = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Tìm user_id từ email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Đếm số lượng thông báo chưa đọc
    const unreadCount = await Notification.countDocuments({
      user_id: user.user_id,
      isRead: false, // Chỉ đếm thông báo chưa đọc
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Lỗi khi đếm thông báo chưa đọc:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Hàm đánh dấu thông báo là đã đọc
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;  // Lấy id thông báo từ params
    const userEmail = req.user.email; // Lấy email từ token đã xác thực

    // Tìm thông báo trong cơ sở dữ liệu
    const notification = await Notification.findOne({
      _id: notificationId,
      user_id: req.user.user_id, // Chỉ cho phép người dùng đánh dấu thông báo của chính họ
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Đánh dấu thông báo là đã đọc
    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
