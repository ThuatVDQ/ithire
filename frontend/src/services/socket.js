// src/services/socket.js
import io from "socket.io-client";

// Khởi tạo kết nối WebSocket
const socket = io("http://localhost:8090");

const registerUser = (userId) => {
  socket.emit("register", userId); // Gửi user_id khi đăng nhập
};

// Lắng nghe thông báo mới
const onNewNotification = (callback) => {
  socket.on("new_notification", callback);
};

// Đảm bảo rằng khi component unmount sẽ xóa sự kiện
const removeNotificationListener = () => {
  socket.off("new_notification");
};

export { socket, registerUser, onNewNotification, removeNotificationListener };
