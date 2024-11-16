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

export default function ModalVerifyOTP({ isOpen, onClose, userEmail }) {
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/verify-otp", {
        email: userEmail,
        otp,
      });
      toast.success("OTP verified successfully!");
      setOtp(""); // Reset OTP field
      onClose(); // Đóng modal
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "OTP verification failed!";
      toast.error(errorMessage);
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
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg"
              placeholder="Enter OTP"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-pills">
            Verify OTP
          </button>
        </form>
      </div>
    </Modal>
  );
}