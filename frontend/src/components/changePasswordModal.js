import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ChangePasswordModal({ show, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    retypePassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    retypePassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.retypePassword) {
      toast.error("New password and retype password do not match!");
      return;
    }
    onSubmit(formData); // Gửi dữ liệu lên server hoặc xử lý thêm
    onClose(); // Đóng modal sau khi hoàn thành
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Current Password */}
          <Form.Group className="mb-3" controlId="formCurrentPassword">
            <Form.Label>Current Password</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPassword.currentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => handleTogglePassword("currentPassword")}
              >
                {showPassword.currentPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>

          {/* New Password */}
          <Form.Group className="mb-3" controlId="formNewPassword">
            <Form.Label>New Password</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => handleTogglePassword("newPassword")}
              >
                {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>

          {/* Retype Password */}
          <Form.Group className="mb-3" controlId="formRetypePassword">
            <Form.Label>Retype New Password</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPassword.retypePassword ? "text" : "password"}
                name="retypePassword"
                value={formData.retypePassword}
                onChange={handleChange}
                placeholder="Retype new password"
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => handleTogglePassword("retypePassword")}
              >
                {showPassword.retypePassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Change Password
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
