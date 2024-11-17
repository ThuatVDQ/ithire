import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecruiterDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:8090/api/recruiter/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDashboardData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" style={{ margin: "20px" }}>
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header
        className="bg-primary text-white text-center"
        style={{
          height: "150px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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
            <div className="card shadow border-0 h-100" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
              <div className="card-body">
                <h3 className="card-title mb-3" style={{ color: "#007bff" }}>
                  {dashboardData.openJobs}
                </h3>
                <p className="card-text text-muted">Active Jobs</p>
              </div>
            </div>
          </div>

          {/* Applications Received */}
          <div className="col-md-4 mb-4">
            <div className="card shadow border-0 h-100" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
              <div className="card-body">
                <h3 className="card-title mb-3" style={{ color: "#28a745" }}>
                  {dashboardData.totalApplications}
                </h3>
                <p className="card-text text-muted">Applications Received</p>
              </div>
            </div>
          </div>

          {/* Total Jobs */}
          <div className="col-md-4 mb-4">
            <div className="card shadow border-0 h-100" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
              <div className="card-body">
                <h3 className="card-title mb-3" style={{ color: "#6c757d" }}>
                  {dashboardData.totalJobs}
                </h3>
                <p className="card-text text-muted">Total Jobs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Statistics */}
        <div className="row">
          <div className="col-md-12">
            <div className="card border-0 shadow mb-4" style={{ borderRadius: "10px" }}>
              <div className="card-body">
                <h4 className="card-title mb-4">Job Statistics</h4>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Total Active Jobs:</strong> {dashboardData.openJobs} active job postings are currently live.
                  </li>
                  <li className="list-group-item">
                    <strong>Pending Applications:</strong> {dashboardData.applicationsInLastTwoWeeks} applications received in the last two weeks.
                  </li>
                  <li className="list-group-item">
                    <strong>Closed Jobs:</strong> {dashboardData.closedJobs} jobs have been successfully closed.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Jobs */}
        <div className="row">
          <div className="col-md-12">
            <div className="card border-0 shadow" style={{ borderRadius: "10px" }}>
              <div className="card-body">
                <h4 className="card-title mb-4">Latest Jobs</h4>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Deadline</th>
                        <th>Slots</th>
                        <th>Status</th>
                        <th>Date Posted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentJobs.map((job) => (
                        <tr key={job._id}>
                          <td>{job.title}</td>
                          <td>{job.type}</td>
                          <td>{new Date(job.deadline).toLocaleDateString()}</td>
                          <td>{job.slots}</td>
                          <td>
                            <span
                              className={`badge ${
                                job.status === "OPEN"
                                  ? "bg-success"
                                  : job.status === "CLOSED"
                                  ? "bg-danger"
                                  : "bg-secondary"
                              }`}
                            >
                              {job.status}
                            </span>
                          </td>
                          <td>
                          {new Date(job.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
