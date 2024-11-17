import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProfileManagement() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    logo: "", // Đảm bảo có logo trong state
    address: "",
    tax_code: "",
    web_url: "",
    scale: "",
    description: "",
  });
  const [isEdit, setIsEdit] = useState(false); // Kiểm tra chế độ tạo mới hay chỉnh sửa
  const [logoFile, setLogoFile] = useState(null); // Quản lý file logo
  const [loading, setLoading] = useState(true); // Kiểm tra trạng thái tải dữ liệu

  // Gọi API để lấy thông tin công ty
  const fetchCompanyInfo = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/recruiter/company", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data && response.data.company) {
        setProfile(response.data.company); // Cập nhật thông tin công ty
        setIsEdit(true); // Chuyển sang chế độ chỉnh sửa
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("No company found, creating a new one.");
      } else {
        console.error("Error fetching company info:", error);
        toast.error("Failed to load company information. Please try again later.");
      }
    } finally {
      setLoading(false); // Đánh dấu việc tải dữ liệu xong
    }
  };

  // Tự động gọi API khi trang được tải
  useEffect(() => {
    fetchCompanyInfo();
  }, []); // Chỉ gọi fetchCompanyInfo một lần khi component mount

  // Hàm tạo công ty
  const createCompany = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8090/api/companies",
        profile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Company created successfully!");
      console.log("Created Company:", response.data);
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create company. Please try again later."
      );
    }
  };

  // Hàm chỉnh sửa công ty
  const editCompany = async () => {
    try {
      console.log(profile)
      const response = await axios.put(
        `http://localhost:8090/api/recruiter/`,
      {
        "name": profile.name,
        "address": profile.address,
        "description": profile.description,
        "scale": profile.scale,
        "web_url": profile.web_url,
        "phone": profile.phone
      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Company information updated successfully!");
      console.log("Updated Company:", response.data);
      fetchCompanyInfo(); // Cập nhật lại thông tin công ty sau khi chỉnh sửa
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update company. Please try again later."
      );
    }
  };

  // Hàm upload hoặc chỉnh sửa logo
  const handleUploadLogo = async () => {
    if (!logoFile) {
      toast.error("Please select a logo to upload.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("logo", logoFile);

      const response = await axios.post(
        "http://localhost:8090/api/companies/upload-logo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Logo uploaded successfully!");
      console.log("Logo Uploaded:", response.data);
      fetchCompanyInfo();
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload logo. Please try again later."
      );
    }
  };

  // Xử lý sự kiện submit thông tin
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await editCompany(); // Chỉnh sửa công ty nếu đang ở chế độ chỉnh sửa
    } else {
      await createCompany(); // Tạo công ty mới nếu không phải chế độ chỉnh sửa
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading trong lúc tải dữ liệu
  }

  return (
    <div>
      <div className="bg-primary text-white text-center py-3 mb-4">
        <h3>Profile Management</h3>
        <p className="mb-0">Create or edit your company profile</p>
      </div>
      <h3 className="mb-4 text-center text-primary">
        {isEdit ? "Edit Profile" : "Create Profile"}
      </h3>
      <div className="row g-4 p-4">
        {/* Logo Section */}
        <div className="col-md-4 text-center">
        <div className="mb-3">
  {logoFile ? (
    <img
      src={URL.createObjectURL(logoFile)}  // Hiển thị logo mới được chọn
      alt="Logo Preview"
      className="rounded-circle shadow-lg img-thumbnail"
      style={{
        width: "150px", 
        height: "150px", 
        objectFit: "cover", 
        cursor: "pointer"  // Thêm cursor pointer để hiển thị như nút bấm
      }}
    />
  ) : profile.logo ? (  // Sử dụng profile.logo để hiển thị logo từ backend
    <img
      src={`http://localhost:8090${profile.logo}`}  // Cập nhật đường dẫn tới thư mục uploads
      alt="Company Logo"
      className="rounded-circle shadow-lg img-thumbnail"
      style={{
        width: "150px", 
        height: "150px", 
        objectFit: "cover", 
        cursor: "pointer"  // Thêm cursor pointer để hiển thị như nút bấm
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
        cursor: "pointer"  // Thêm cursor pointer để hiển thị như nút bấm
      }}
    >
      {profile.name ? profile.name[0] : "?"}  // Hiển thị chữ cái đầu tiên của tên công ty nếu không có logo
    </div>
  )}
</div>

          <label className="btn btn-outline-primary btn-sm">
            Choose Logo
            <input
              type="file"
              className="d-none"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files[0])}
            />
          </label>
          <div className="mt-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleUploadLogo}
            >
              {isEdit ? "Update Logo" : "Upload Logo"}
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
              <label className="form-label fw-semibold">Company Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter company name"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                placeholder="Enter company address"
                required
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  placeholder="Enter email"
                  required
                  readOnly={isEdit}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div className="row">
  <div className="col-md-6 mb-3">
    <label className="form-label fw-semibold">Tax Code</label>
    <input
      type="text"
      name="tax_code"
      className="form-control"
      value={profile.tax_code}
      onChange={(e) =>
        setProfile({ ...profile, tax_code: e.target.value })
      }
      placeholder="Enter tax code"
      required
      readOnly={isEdit}
    />
  </div>

  <div className="col-md-6 mb-3">
    <label className="form-label fw-semibold">Scale</label>
    <input
      type="number"
      name="scale"
      className="form-control"
      value={profile.scale}
      onChange={(e) =>
        setProfile({ ...profile, scale: e.target.value })
      }
      placeholder="Enter company scale"
    />
  </div>
</div>


            <div className="mb-3">
              <label className="form-label fw-semibold">Website</label>
              <input
                type="url"
                name="web_url"
                className="form-control"
                value={profile.web_url}
                onChange={(e) =>
                  setProfile({ ...profile, web_url: e.target.value })
                }
                placeholder="Enter website URL"
              />
            </div>

            

            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={profile.description}
                onChange={(e) =>
                  setProfile({ ...profile, description: e.target.value })
                }
                placeholder="Enter company description"
              ></textarea>
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary px-4">
                {isEdit ? "Update Info" : "Create Info"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
