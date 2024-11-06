const Notification = require("../models/Notification");
const User = require("../models/User");

// Hàm tạo thông báo mới
exports.createNotification = async (user_id, message) => {
  try {
    const notification = new Notification({
      message,
      user_id,
      send_at: new Date(),
    });
    await notification.save();
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
