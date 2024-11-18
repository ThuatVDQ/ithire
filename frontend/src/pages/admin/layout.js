import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBriefcase,
  FaUsers,
  FaUserCircle,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPlus,
  FaBuilding,
  FaInfo,
  FaRegUserCircle,
} from "react-icons/fa";

export default function RecruiterLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      {!isSidebarCollapsed ? (
        <aside
          className="bg-dark text-white position-fixed"
          style={{
            width: "250px",
            height: "100vh",
            overflowY: "auto",
            transition: "width 0.3s",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-between p-3 border-bottom"
            style={{ borderBottom: "1px solid #495057" }}
          >
            <h5 className="m-0">IT Hire</h5>
            <button
              className="btn-sm"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "white", // Nền trắng
                color: "black", // Icon màu đen
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)", // Bóng mờ
                fontSize: "20px", // Kích thước icon
              }}
              onClick={() => setIsSidebarCollapsed(true)}
            >
              <FaTimes /> {/* Đảm bảo icon hiển thị */}
            </button>
          </div>
          <nav className="nav flex-column p-2">
            <Link
              to="/admin/dashboard"
              className="nav-link text-white d-flex align-items-center mb-3"
            >
              <FaTachometerAlt className="me-2" />
              Dashboard
            </Link>
            <Link
              to="/admin/jobs"
              className="nav-link text-white d-flex align-items-center mb-3"
            >
              <FaBriefcase className="me-2" />
              Manage Jobs
            </Link>
            <Link
              to="/admin/companies"
              className="nav-link text-white d-flex align-items-center mb-3"
            >
              <FaBuilding className="me-2" />
              Mangage Companies
            </Link>
            <Link
              to="/admin/users"
              className="nav-link text-white d-flex align-items-center mb-3"
            >
              <FaUsers className="me-2" />
              Manage Users
            </Link>
            <Link
              to="/admin/login"
              className="nav-link text-danger d-flex align-items-center mb-3"
              onClick={() => {
                localStorage.removeItem("token"); 
              }}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </Link>
          </nav>
        </aside>
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            position: "fixed",
            top: "60px",
            left: "20px",
            cursor: "pointer",
            backgroundColor: "white",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
            transition: "transform 0.3s ease",
          }}
          onClick={() => setIsSidebarCollapsed(false)}
        >
          <FaBars style={{ fontSize: "20px", color: "black" }} />
        </div>
      )}

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarCollapsed ? "0" : "250px", // Đẩy nội dung chính khi sidebar mở rộng
          transition: "margin-left 0.3s",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
