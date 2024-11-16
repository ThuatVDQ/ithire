import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ModalVerifyOTP from "../../components/modalVerifyOTP";

import bg1 from "../../assets/images/hero/bg3.jpg";

export default function Signup() {
  const [isModalOpen, setModalOpen] = useState(false); 
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      password: formData.get("password"),
      retypePassword: formData.get("retypePassword"),
      phone: formData.get("phone"),
      role_id: 3, 
    };

    // Kiểm tra mật khẩu khớp
    if (data.password !== data.retypePassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Gửi yêu cầu đăng ký tới API
      const response = await axios.post("/signup", data);
      toast.success("Register successful. Please verify OTP sent to your email.");
      setUserEmail(data.email); 
      setModalOpen(true); 
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed. Please try again.";
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
                  Register your account
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
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    required
                  />
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
                  Register as Job Seeker
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Modal nhập OTP */}
        <ModalVerifyOTP
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          userEmail={userEmail}
        />
    </section>
  );
}
