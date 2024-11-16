import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ModalVerifyOTP from "../../components/modalVerifyOTP";

import bg1 from "../../assets/images/hero/bg3.jpg";

export default function SignupRecruiter() {
  const [isModalOpen, setModalOpen] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRetypePasswordVisibility = () => {
    setShowRetypePassword(!showRetypePassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      password: formData.get("password"),
      retypePassword: formData.get("retypePassword"),
      phone: formData.get("phone"),
      role_id: 2, // Role ID dành cho Recruiter
    };

    // Kiểm tra mật khẩu khớp
    if (data.password !== data.retypePassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Gửi yêu cầu đăng ký tới API
      const response = await axios.post("http://localhost:8090/api/auth/signup", data); 
      toast.success("Register successful. Please verify OTP sent to your email.");
      setUserEmail(data.email); 
      setModalOpen(true); 
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleVerifySuccess = () => {
    setModalOpen(false);
    navigate("/recruiter/login"); // Chuyển hướng đến trang login của Recruiter
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
                  Register your company account
                </h6>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Name</label>
                  <input
                    name="full_name"
                    id="name"
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                    required
                  />
                </div>
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
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Password"
                      required
                    />
                    <span
                      className="input-group-text"
                      style={{ cursor: "pointer" }}
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Retype Password
                  </label>
                  <div className="input-group">
                    <input
                      name="retypePassword"
                      type={showRetypePassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Retype Password"
                      required
                    />
                    <span
                      className="input-group-text"
                      style={{ cursor: "pointer" }}
                      onClick={toggleRetypePasswordVisibility}
                    >
                      {showRetypePassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone</label>
                  <input
                    name="phone"
                    type="text"
                    className="form-control"
                    placeholder="Your Phone Number"
                  />
                </div>
                <button className="btn btn-primary w-100" type="submit">
                  Register as Recruiter
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Modal nhập OTP */}
        <ModalVerifyOTP
          isOpen={isModalOpen}
          userEmail={userEmail}
          onClose={() => setModalOpen(false)}
          onVerifySuccess={handleVerifySuccess}
        />
    </section>
  );
}
