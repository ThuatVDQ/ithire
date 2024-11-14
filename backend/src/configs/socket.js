const socketIo = require("socket.io");

let io;

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000", // Đảm bảo CORS cho frontend
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Lắng nghe sự kiện gửi thông báo từ frontend
    socket.on("send_notification", (data) => {
      console.log("Notification data:", data);
      io.emit("notification", data);  // Phát thông báo tới tất cả các client đang kết nối
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

const getSocket = () => {
  return io;  // Trả về instance của socket.io
};

module.exports = { initSocket, getSocket };
