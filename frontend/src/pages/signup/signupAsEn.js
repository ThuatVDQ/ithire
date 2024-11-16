import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import ModalVerifyOTP from "../../components/modalVerifyOTP";
import "react-toastify/dist/ReactToastify.css";

import bg1 from "../../assets/images/hero/bg3.jpg";
import "../../assets/css/eyes.css";

export default function SignupEn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setModalOpen] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      email: formData.get("email"),
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      retypePassword: formData.get("retypePassword"),
      role_id: 2, // Role ID cho Recruiter
    };

    try {
      const response = await axios.post("/signup", data); // API của bạn
      toast.success(
        "Register successful. Please verify OTP sent to your email."
      );
      setUserEmail(data.email); // Lưu email để sử dụng khi gửi OTP
      setModalOpen(true); // Hiển thị modal nhập OTP
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
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
                  Register as Enterprise
                </h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    name="full_name"
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone</label>
                  <input
                    name="phone"
                    type="text"
                    className="form-control"
                    placeholder="Phone Number"
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
                      className="input-group-append"
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
                  <input
                    name="retypePassword"
                    type="password"
                    className="form-control"
                    placeholder="Retype Password"
                    required
                  />
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  Register
                </button>

                <div className="col-12 text-center mt-3">
                  <span>
                    <span className="text-muted me-2 small">
                      You already have a account ?
                    </span>
                    <Link
                      to="/recruiter/login"
                      className="text-dark fw-semibold small"
                    >
                      Login
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ModalVerifyOTP
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        userEmail={userEmail}
      />
    </section>
  );
}
