// src/configs/socket.js

const socketIo = require("socket.io");

let io;
let userSockets = {}; // Lưu thông tin user_id và socket_id

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000", // Đảm bảo CORS cho frontend
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Khi người dùng đăng nhập, lưu socket.id với user_id
    socket.on("register", (user_id) => {
      userSockets[user_id] = socket.id; // Lưu user_id và socket.id
      console.log(`User ${user_id} is connected with socket id ${socket.id}`);
    });

    // Lắng nghe sự kiện gửi thông báo từ frontend
    socket.on("send_notification", (data) => {
      console.log("Notification data:", data);
      const { user_id, message } = data;

      // Phát thông báo cho một user cụ thể
      if (userSockets[user_id]) {
        io.to(userSockets[user_id]).emit("new_notification", { message });
      }
    });

    socket.on("disconnect", () => {
      // Xóa socket.id khi người dùng ngắt kết nối
      for (let user_id in userSockets) {
        if (userSockets[user_id] === socket.id) {
          delete userSockets[user_id];
          console.log(`User ${user_id} disconnected`);
          break;
        }
      }
    });
  });
};

const getSocket = () => {
  return io;  // Trả về instance của socket.io
};

module.exports = { initSocket, getSocket };
