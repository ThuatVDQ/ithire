// src/components/NotificationComponent.js
import React, { useEffect, useState } from "react";
import { onNewNotification, removeNotificationListener } from "../services/socket";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Lắng nghe thông báo mới từ WebSocket
    onNewNotification((data) => {
      setNotifications((prev) => [...prev, data.message]);
    });

    return () => {
      // Cleanup listener khi component unmount
      removeNotificationListener();
    };
  }, []);

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;
