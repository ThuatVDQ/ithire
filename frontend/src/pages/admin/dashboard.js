import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table } from "react-bootstrap";
import { FaBuilding, FaUser, FaBriefcase, FaClock } from "react-icons/fa";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:8090/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  return (
    <div >
      <h2 className="mb-4 p-4 text-center text-white font-bold bg-primary">Admin Dashboard</h2>
        <div className="container">
      <div className="row g-4">
        {/* Stats Cards */}
        <div className="col-lg-3 col-md-6">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <FaBriefcase size={36} className="text-primary mb-2" />
              <h5>Total Jobs</h5>
              <h4>{dashboardData.totalJobs}</h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-lg-3 col-md-6">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <FaBuilding size={36} className="text-success mb-2" />
              <h5>Total Companies</h5>
              <h4>{dashboardData.totalCompanies}</h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-lg-3 col-md-6">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <FaUser size={36} className="text-warning mb-2" />
              <h5>Total Users</h5>
              <h4>{dashboardData.totalUsers}</h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-lg-3 col-md-6">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <FaClock size={36} className="text-danger mb-2" />
              <h5>Open Jobs</h5>
              <h4>{dashboardData.openJobs}</h4>
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="row g-4 mt-5">
        <div className="col-lg-6">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <FaBuilding size={36} className="text-info mb-2" />
              <h5>Companies Created (Last 2 Weeks)</h5>
              <h4>{dashboardData.companiesInLastTwoWeeks}</h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-lg-6">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <FaUser size={36} className="text-success mb-2" />
              <h5>Users Registered (Last 2 Weeks)</h5>
              <h4>{dashboardData.usersInLastTwoWeeks}</h4>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Recent Companies */}
      <div className="mt-5">
        <h4>Recent Companies</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentCompanies.map((company, index) => (
              <tr key={company._id}>
                <td>{index + 1}</td>
                <td>{company.name}</td>
                <td>{new Date(company.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Recent Users */}
      <div className="mt-5">
        <h4>Recent Users</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Additional Stats */}
      
      </div>    
    </div>
  );
}
