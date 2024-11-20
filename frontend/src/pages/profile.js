import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import authApi from "../api/authApi"; // Import the API
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);

  // States for changing password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User is not logged in.");
        }
        const data = await authApi.getUserInfo(token);
        setUserInfo(data.user);
      } catch (error) {
        console.error("Error fetching user info:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Nếu có tệp, tạo URL tạm thời cho việc xem trước
      const fileUrl = URL.createObjectURL(file);
      setAvatarPreview(fileUrl); // Lưu URL vào state
      setAvatarFile(file); // Lưu tệp vào state
    } else if (avatarFile) {
      setAvatarPreview(URL.createObjectURL(avatarFile)); // Nếu không có tệp, reset preview
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error("Please select an avatar to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const token = localStorage.getItem("token");
      const response = await authApi.uploadAvatar(formData, token);
      setUserInfo((prev) => ({ ...prev, avatar_url: response.avatar_url }));
      setAvatarPreview(null);
      setAvatarFile(null);
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error.message);
      toast.error("Failed to upload avatar.");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedInfo = {
        full_name: userInfo.full_name,
        gender: userInfo.gender,
        introduction: userInfo.introduction,
        phone: userInfo.phone,
      };

      const response = await authApi.updateUser(updatedInfo, token);
      setUserInfo(response.user); // Update state with the new user info
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.error("Failed to update profile.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validate passwords
    if (!oldPassword) errors.oldPassword = "Old password is required.";
    if (!newPassword) errors.newPassword = "New password is required.";
    if (newPassword !== confirmPassword)
      errors.confirmPassword = "Passwords do not match.";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await authApi.changePassword(
        { oldPassword, newPassword, confirmPassword },
        token
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Error changing password:", error.message);
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="container text-center my-5">
        <h2>User not logged in!</h2>
        <p className="text-muted">
          Please <Link to={`/login`}>log in</Link> to view and edit your
          profile.
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar navClass="defaultscroll sticky" navLight={false} />
      <section className="profile-page py-5 bg-light">
        <div className="container pt-4">
          <div className="row g-4">
            {/* Left Section */}
            <div className="col-md-4">
              <div className="card shadow-sm p-4 text-center">
              <div
    className="d-flex justify-content-center align-items-center"
    style={{
      width: "100%",
      height: "120px",
    }}
  >
    <img
      src={avatarPreview || `http://localhost:8090${userInfo.avatar_url}` || "/default-avatar.png"}
      alt="Profile Avatar"
      className="rounded-circle mb-3"
      style={{
        width: "120px",
        height: "120px",
        objectFit: "cover",
      }}
    />
  </div>
                <h5 className="mb-1">
                  Welcome, {userInfo.full_name || "User"}
                </h5>
                <span className="badge bg-success mb-3">{userInfo.status}</span>

                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-2"
                  onChange={handleAvatarChange}
                />
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={handleAvatarUpload}
                >
                  Upload Avatar
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-md-8">
              <div className="card shadow-sm p-4">
                <h5 className="mb-4">Personal Details</h5>
                <form onSubmit={handleProfileUpdate}>
                  <div className="mb-3">
                    <label htmlFor="introduction" className="form-label">
                      Introduction
                    </label>
                    <textarea
                      className="form-control"
                      id="introduction"
                      rows="3"
                      value={userInfo.introduction || ""}
                      onChange={(e) =>
                        setUserInfo((prev) => ({
                          ...prev,
                          introduction: e.target.value,
                        }))
                      }
                    ></textarea>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="fullName" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        className="form-control"
                        value={userInfo.full_name || ""}
                        onChange={(e) =>
                          setUserInfo((prev) => ({
                            ...prev,
                            full_name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="gender" className="form-label">
                        Gender
                      </label>
                      <select
                        className="form-select"
                        id="gender"
                        value={userInfo.gender || ""}
                        onChange={(e) =>
                          setUserInfo((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label">
                        Phone
                      </label>
                      <input
                        type="text"
                        id="phone"
                        className="form-control"
                        value={userInfo.phone || ""}
                        onChange={(e) =>
                          setUserInfo((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={userInfo.email || ""}
                        disabled
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary mt-4">
                    Save Changes
                  </button>
                </form>
              </div>
              <div className="col-md-6 mt-4 pt-2 card shadow-sm p-4">
                <h5>Change password :</h5>
                <form onSubmit={handlePasswordChange}>
                  <div className="row mt-4">
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Old password :
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Old password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                        {errors.oldPassword && (
                          <div className="invalid-feedback d-block">
                            {errors.oldPassword}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          New password :
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="New password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        {errors.newPassword && (
                          <div className="invalid-feedback d-block">
                            {errors.newPassword}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Confirm password :
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback d-block">
                            {errors.confirmPassword}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12 mt-2 mb-0">
                      <button type="submit" className="btn btn-primary">
                        Save password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer top={true} />
    </>
  );
}
