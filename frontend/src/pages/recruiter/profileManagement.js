import React, { useState } from "react";

export default function ProfileManagement() {
  const [profile, setProfile] = useState({
    name: "ABC Company",
    email: "recruiter@example.com",
    phone: "123-456-7890",
    avatar: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div>
      <h3 className="mb-4">Profile Management</h3>
      <div className="row">
        {/* Avatar Section */}
        <div className="col-md-4 text-center">
          <div className="mb-3">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="rounded-circle img-thumbnail"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "150px",
                  height: "150px",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                {profile.name[0]}
              </div>
            )}
          </div>
          <label className="btn btn-outline-secondary btn-sm">
            Upload Avatar
            <input
              type="file"
              className="d-none"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {/* Profile Form Section */}
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={profile.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={profile.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
