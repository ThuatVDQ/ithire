import React from "react";

export default function RecruiterDashboard() {
  return (
    <div>
      {/* Header */}
      <header
        className="bg-primary text-white text-center"
        style={{
          height: "150px", // Chiều cao cố định
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Đưa nội dung vào giữa
          alignItems: "center",
        }}
      >
        <h2 className="mb-2">Welcome to Recruiter Dashboard</h2>
        <p className="lead">Manage your jobs, applications, and statistics</p>
      </header>

      {/* Content Wrapper */}
      <div className="container-fluid px-4 mt-4">
        <div className="row text-center">
          {/* Active Jobs */}
          <div className="col-md-4 mb-4">
            <div
              className="card shadow border-0 h-100"
              style={{
                backgroundColor: "#f8f9fa", // Màu nền sáng nhẹ
                borderRadius: "10px", // Bo góc thẻ
              }}
            >
              <div className="card-body">
                <h3 className="card-title mb-3" style={{ color: "#007bff" }}>
                  5
                </h3>
                <p className="card-text text-muted">Active Jobs</p>
              </div>
            </div>
          </div>

          {/* Applications Received */}
          <div className="col-md-4 mb-4">
            <div
              className="card shadow border-0 h-100"
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "10px",
              }}
            >
              <div className="card-body">
                <h3 className="card-title mb-3" style={{ color: "#28a745" }}>
                  20
                </h3>
                <p className="card-text text-muted">Applications Received</p>
              </div>
            </div>
          </div>

          {/* Total Jobs */}
          <div className="col-md-4 mb-4">
            <div
              className="card shadow border-0 h-100"
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "10px",
              }}
            >
              <div className="card-body">
                <h3 className="card-title mb-3" style={{ color: "#6c757d" }}>
                  15
                </h3>
                <p className="card-text text-muted">Total Jobs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Statistics */}
        <div className="row">
          <div className="col-md-12">
            <div
              className="card border-0 shadow mb-4"
              style={{
                borderRadius: "10px",
              }}
            >
              <div className="card-body">
                <h4 className="card-title mb-4">Job Statistics</h4>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Total Active Jobs:</strong> 5 active job postings are currently live.
                  </li>
                  <li className="list-group-item">
                    <strong>Pending Applications:</strong> 20 applications are waiting for review.
                  </li>
                  <li className="list-group-item">
                    <strong>Completed Jobs:</strong> 8 jobs have been successfully closed this month.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Jobs */}
        <div className="row">
          <div className="col-md-12">
            <div
              className="card border-0 shadow"
              style={{
                borderRadius: "10px",
              }}
            >
              <div className="card-body">
                <h4 className="card-title mb-4">Latest Jobs</h4>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Frontend Developer:</strong> Posted 2 days ago.
                  </li>
                  <li className="list-group-item">
                    <strong>Backend Developer:</strong> Posted 3 days ago.
                  </li>
                  <li className="list-group-item">
                    <strong>UI/UX Designer:</strong> Posted 5 days ago.
                  </li>
                  <li className="list-group-item">
                    <strong>Project Manager:</strong> Posted 1 week ago.
                  </li>
                  <li className="list-group-item">
                    <strong>Data Analyst:</strong> Posted 2 weeks ago.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
