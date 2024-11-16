import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 50,
  },
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    overflow: "hidden",
    position: "relative",
  },
};

export default function ModalVerifyOTP({ isOpen, userEmail, onClose, onVerifySuccess }) {
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false); // Trạng thái gửi lại OTP

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8090/api/auth/verify-otp",
        {
          email: userEmail,
          otp,
        }
      );
      toast.success("OTP verified successfully!");
      setOtp("");
      onVerifySuccess();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "OTP verification failed!";
      toast.error(errorMessage);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true); // Bắt đầu trạng thái gửi lại
    try {
      const response = await axios.post(
        "http://localhost:8090/api/auth/resend-otp",
        {
          email: userEmail,
        }
      );
      toast.success("OTP has been resent to your email!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsResending(false); // Kết thúc trạng thái gửi lại
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // Chỉ cho phép 6 chữ số
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      ariaHideApp={false}
      overlayClassName="fixed inset-0 flex items-center justify-center z-50"
      className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
    >
      <div className="modalHeader">
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
          }}
          className="btn-close absolute top-3 right-3 text-gray-500 hover:text-black focus:outline-none"
        ></button>
        <h5 className="text-lg font-semibold mb-6">Enter OTP</h5>
        <p className="text-sm text-gray-600 mb-4">
          We’ve sent an OTP to your email: <b>{userEmail}</b>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              value={otp}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg"
              placeholder="Enter OTP"
              required
               maxLength={6} 
              inputMode="numeric"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-pills w-full">
            Verify OTP
          </button>
        </form>
        <div className="mt-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!isResending) handleResendOTP();
            }}
            className={`text-decoration-underline text-muted small ${
              isResending ? "disabled-link" : ""
            }`}
            style={{ cursor: isResending ? "not-allowed" : "pointer" }}
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </a>
        </div>
      </div>
    </Modal>
  );
}
