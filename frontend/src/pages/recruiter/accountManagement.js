import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import authApi from "../../api/authApi"; 

export default function AccountManagement() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    avatar_url: "",
    gender: "",
    introduction: "",
  });
  const [isEdit, setIsEdit] = useState(true);
  const [isEditPhone, setIsEditPhone] = useState(false); // Chế độ chỉ chỉnh sửa (Không cần tạo mới)
  const [avatarFile, setAvatarFile] = useState(null); // Quản lý file avatar
  const [loading, setLoading] = useState(true); // Kiểm tra trạng thái tải dữ liệu

  // Lấy thông tin tài khoản của người dùng từ API
  const fetchUserInfo = async () => {
    try {
      const response = await authApi.getUserInfo(localStorage.getItem("token"));

      setProfile(response.user); 
      if (response.user.phone) {
        setIsEditPhone(true); // Không cho chỉnh sửa số điện thoại
      }
      console.log("User Info:", response.user);
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast.error("Failed to load user information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []); // Gọi API một lần khi component được render

  // Hàm chỉnh sửa tài khoản
  const editAccount = async () => {
    try {
      const response = await authApi.updateUser({"full_name": profile.full_name, "gender": profile.gender, "introduction": profile.introduction, "phone": profile.phone}, localStorage.getItem("token"));

      toast.success("Account information updated successfully!");
      console.log("Updated Account:", response.data);
      fetchUserInfo(); // Cập nhật lại thông tin người dùng sau khi chỉnh sửa
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Failed to update account. Please try again later.");
    }
  };

  // Hàm upload hoặc chỉnh sửa avatar
  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      toast.error("Please select an avatar to upload.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await authApi.uploadAvatar(formData, localStorage.getItem("token"));

      toast.success("Avatar uploaded successfully!");
      console.log("Avatar Uploaded:", response.data);
      fetchUserInfo(); 
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar. Please try again later.");
    }
  };

  // Xử lý sự kiện submit thông tin
  const handleSubmit = async (e) => {
    e.preventDefault();
    await editAccount(); // Chỉnh sửa tài khoản người dùng
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading trong lúc tải dữ liệu
  }

  return (
    <div>
      <div className="bg-primary text-white text-center py-3 mb-4">
        <h3>Account Management</h3>
        <p className="mb-0">Edit your account details</p>
      </div>
      <h3 className="mb-4 text-center text-primary">Edit Account</h3>
      <div className="row g-4 p-4">
        {/* Avatar Section */}
        <div className="col-md-4 text-center">
          <div className="mb-3">
            {avatarFile ? (
              <img
                src={URL.createObjectURL(avatarFile)} // Hiển thị avatar mới được chọn
                alt="Avatar Preview"
                className="rounded-circle shadow-lg img-thumbnail"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
            ) : profile.avatar_url ? (  // Hiển thị avatar từ backend
              <img
                src={`http://localhost:8090${profile.avatar_url}`}  // Đường dẫn avatar
                alt="User Avatar"
                className="rounded-circle shadow-lg img-thumbnail"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg"
                style={{
                  width: "150px",
                  height: "150px",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                {profile.full_name ? profile.full_name[0] : "?"}
              </div>
            )}
          </div>

          <label className="btn btn-outline-primary btn-sm">
            Choose Avatar
            <input
              type="file"
              className="d-none"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
          </label>
          <div className="mt-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleUploadAvatar}
            >
              Update Avatar
            </button>
          </div>
        </div>

        {/* Profile Form Section */}
        <div className="col-md-8">
          <form
            onSubmit={handleSubmit}
            className="p-4 border rounded shadow-sm bg-light"
          >
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                name="full_name"
                className="form-control"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter email"
                required
                readOnly={isEdit}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={profile.phone}
                  onChange={(e) => {
                    // Chỉ cho phép nhập các ký tự số
                    const newValue = e.target.value.replace(/[^0-9]/g, '');
                    setProfile({ ...profile, phone: newValue });
                  }}
                  placeholder="Enter phone number"
                  required
                  readOnly={isEditPhone}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Gender</label>
                <select
                  name="gender"
                  className="form-control"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
        
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Introduction</label>
              <textarea
                name="introduction"
                className="form-control"
                rows="4"
                value={profile.introduction}
                onChange={(e) => setProfile({ ...profile, introduction: e.target.value })}
                placeholder="Enter introduction"
              ></textarea>
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary px-4">
                Update Info
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
