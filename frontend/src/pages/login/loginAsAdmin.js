import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import ModalVerifyOTP from "../../components/modalVerifyOTP";
import "react-toastify/dist/ReactToastify.css";

import bg1 from "../../assets/images/hero/bg3.jpg";
import "../../assets/css/eyes.css";

export default function LoginRecruiter() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isModalOpen, setModalOpen] = useState(false); 

  // Hiển thị/Ẩn mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Xử lý sự kiện submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      role_id: 1, // roleId dành cho Recruiter
    };

    try {
      // Gửi request đăng nhập
      const response = await axios.post("http://localhost:8090/api/auth/login", data);

      localStorage.setItem("token", response.data.token);
      toast.success("Login successful!");

      navigate("/admin/dashboard");
    } catch (error) {
      // Xử lý lỗi từ server
      const errorMessage = error.response
        ? error.response.data.error
        : error.message;

      setUserEmail(data.email); 
      toast.error(errorMessage);
      console.error({ message: errorMessage });
    }
  };

  // Callback khi xác minh thành công
  const handleVerifySuccess = () => {
    setModalOpen(false); 
    navigate("/recruiter/login"); 
  };

  const handleResendOTP = async () => {
    try {
      await axios.post("http://localhost:8090/api/auth/resend-otp", {
        email: userEmail,
      });
      toast.success("OTP has been resent to your email.");
      setModalOpen(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP.";
      toast.error(errorMessage);
    }
  };

  return (
    <section
      className="bg-home d-flex align-items-center"
      style={{ backgroundImage: `url(${bg1})`, backgroundPosition: "center" }}
    >
      <div className="bg-overlay bg-linear-gradient-2"></div>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-5 col-12">
            <div
              className="p-4 bg-white rounded shadow-md mx-auto w-100"
              style={{ maxWidth: "400px" }}
            >
              <form onSubmit={handleSubmit}>
                <Link to="/">
                  <span className="logo l-light mb-4 d-block mx-auto">
                    ITHIRE
                  </span>
                </Link>
                <h6 className="mb-3 text-uppercase fw-semibold">
                  Please sign in as Admin
                </h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Email</label>
                  <input
                    name="email"
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="example@gmail.com"
                    required
                    value={userEmail} 
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="loginpass">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="loginpass"
                      name="password"
                      placeholder="Password"
                      required
                    />
                    <span
                      className="input-group-append"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  Sign in
                </button>

                {/* Hiển thị nút Verify Account */}
                {userEmail && (
                  <div className="mt-4 text-center">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleResendOTP();
                      }}
                      className="text-decoration-underline text-muted small"
                    >
                      Verify account
                    </a>
                  </div>
                )}

                <div className="col-12 text-center mt-3">
                  <span>
                    <span className="text-muted me-2 small">
                      Don't have an account?
                    </span>
                    <Link to="/recruiter/signup" className="text-dark fw-semibold small">
                      Sign Up
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Verify OTP */}
      <ModalVerifyOTP
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)} 
        userEmail={userEmail} 
        onVerifySuccess={handleVerifySuccess} 
      />
    </section>
  );
}
