import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import bg1 from "../../assets/images/hero/bg3.jpg";
import logo from "../../assets/images/logo-dark.png";
import "../../assets/css/eyes.css";

export default function LoginRecruiter() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
      role_id: 2, // roleId dành cho Recruiter
    };

    try {
      // Gửi request đăng nhập
      const response = await axios.post("http://localhost:8080/login", data);

      // Lưu token và thông báo thành công
      localStorage.setItem("token", response.data.token);
      toast.success("Login successful!");

      // Chuyển hướng đến trang quản lý
      navigate("/dashboard");
    } catch (error) {
      // Xử lý lỗi từ server
      const errorMessage = error.response
        ? error.response.data.error
        : error.message;

      if (
        error.response &&
        error.response.data.error ===
          "OTP not verified. Please verify your OTP before logging in."
      ) {
        // Điều hướng đến trang xác minh OTP
        toast.info("OTP not verified. Redirecting to verification page.");
        navigate(`/enterprise/verify?email=${data.email}`);
      } else {
        // Hiển thị thông báo lỗi khác
        toast.error(errorMessage);
        console.error({ message: errorMessage });
      }
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
                  Please sign in as Recruiter
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

                <div className="col-12 text-center mt-3">
                  <span>
                    <span className="text-muted me-2 small">
                      Don't have an account?
                    </span>
                    <Link
                      to="/recruiter/signup"
                      className="text-dark fw-semibold small"
                    >
                      Sign Up
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
