import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Pagination, Form, Spinner } from "react-bootstrap";
import { FaCheck, FaTimes, FaSearch, FaBan } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    totalJobs: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const [searchFilters, setSearchFilters] = useState({
    title: "",
    location: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [pagination.currentPage]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8090/api/admin/jobs/search", {
        params: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          ...searchFilters,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setJobs(response.data.jobs || []);
      setPagination({
        totalJobs: response.data.pagination.totalJobs,
        totalPages: response.data.pagination.totalPages,
        currentPage: response.data.pagination.currentPage,
        pageSize: response.data.pagination.pageSize,
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId) => {
    try {
      await axios.post(
        `http://localhost:8090/api/admin/jobs/approve/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchJobs();
    } catch (error) {
      console.error("Error approving job:", error);
      toast.error(error.response.data.message || "Failed to approve the job.");
    }
  };

  const handleReject = async (jobId) => {
    try {
      await axios.post(
        `http://localhost:8090/api/admin/jobs/reject/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchJobs();
    } catch (error) {
      console.error("Error rejecting job:", error);
      toast.error(error.response.data.message || "Failed to reject the job.");
    }
  };

  const handleClose = async (jobId) => {
    try {
      await axios.put(
        `http://localhost:8090/api/admin/jobs/${jobId}/close`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Job closed successfully!");
      fetchJobs();
    } catch (error) {
      console.error("Error closing job:", error);
      alert("Failed to close the job.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to the first page
    fetchJobs();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Jobs</h2>

      {/* Search Filters */}
      <Form onSubmit={handleSearch} className="d-flex flex-wrap gap-3 align-items-center mb-4">
  {/* Search by Title */}
  <div className="col-lg-3 col-md-4 col-sm-6" style={{ maxWidth: "200px" }}>
    <Form.Control
      type="text"
      placeholder="Search by title"
      value={searchFilters.title}
      onChange={(e) =>
        setSearchFilters((prev) => ({ ...prev, title: e.target.value }))
      }
      className="me-2"
    />
  </div>

  {/* Search by Location */}
  <div className="col-lg-3 col-md-4 col-sm-6" style={{ maxWidth: "200px" }}>
    <Form.Control
      type="text"
      placeholder="Search by location"
      value={searchFilters.location}
      onChange={(e) =>
        setSearchFilters((prev) => ({ ...prev, location: e.target.value }))
      }
      className="me-2"
    />
  </div>

  {/* Select Type */}
  <div className="col-lg-3 col-md-4 col-sm-6" style={{ maxWidth: "200px" }}>
    <Form.Select
      value={searchFilters.type}
      onChange={(e) =>
        setSearchFilters((prev) => ({ ...prev, type: e.target.value }))
      }
      className="me-2"
    >
      <option value="">All Types</option>
      <option value="FULL_TIME">Full Time</option>
      <option value="PART_TIME">Part Time</option>
      <option value="INTERNSHIP">Internship</option>
    </Form.Select>
  </div>

  {/* Search Button */}
  <div className="col-lg-3 col-md-4 col-sm-6" style={{ maxWidth: "120px" }}>
  <Button type="submit" variant="primary" className="d-flex align-items-center justify-content-center">
  <FaSearch className="me-2" />
  <span>SEARCH</span>
</Button>

  </div>
</Form>



      {/* Job List */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job, index) => (
                  <tr key={job._id}>
                    <td>
                      {(pagination.currentPage - 1) * pagination.pageSize +
                        index +
                        1}
                    </td>
                    <td>{job.title}</td>
                    <td>{job.company?.name || "N/A"}</td>
                    <td>
                      {job.address?.length > 0
                        ? job.address.map((addr) => addr.city).join(", ")
                        : "N/A"}
                    </td>
                    <td>{job.type}</td>
                    <td>{job.status}</td>
                    <td>
  <div className="d-flex gap-2">
    {job.status === "PENDING" ? (
      <>
        <Button
          variant="success"
          className="btn-sm" // Thêm class này
          onClick={() => handleApprove(job.job_id)}
        >
          <FaCheck /> Approve
        </Button>
        <Button
          variant="danger"
          className="btn-sm" // Thêm class này
          onClick={() => handleReject(job.job_id)}
        >
          <FaTimes /> Reject
        </Button>
      </>
    ) : job.status === "OPEN" ? (
      <Button
        variant="warning"
        className="btn-sm" // Thêm class này
        onClick={() => handleClose(job.job_id)}
      >
        Close
      </Button>
    ) : null}
  </div>
</td>


                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              {[...Array(pagination.totalPages)].map((_, page) => (
                <Pagination.Item
                  key={page + 1}
                  active={page + 1 === pagination.currentPage}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, currentPage: page + 1 }))
                  }
                >
                  {page + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
