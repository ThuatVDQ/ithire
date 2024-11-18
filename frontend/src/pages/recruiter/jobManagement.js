import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function JobManagement() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchQuery, pageSize]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/recruiter/jobs", {
        params: {
          page: currentPage,
          limit: pageSize,
          search: searchQuery,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(response.data);
  
      setJobs(response.data.jobs);
      setTotalPages(response.data.pagination.totalPages);
      console.log("Jobs fetched successfully!");
    } catch (error) {
      console.error("Error fetching jobs:", error);
  
      // Kiểm tra xem lỗi từ backend có chứa thông tin không
      const errorMessage = error.response?.data?.message || "Unable to fetch jobs. Please try again later.";
  
      if (errorMessage === "Invalid token.") {
        // Đăng xuất người dùng nếu token không hợp lệ
        localStorage.removeItem("token");
        navigate("/recruiter/login");
        toast.error("Your session has expired. Please log in again.");
      }
      // Hiển thị thông báo lỗi từ backend
      toast.error(errorMessage);
    }
  };
  

  const handleDownloadCVs = async (job_id) => {
    try {
      const response = await axios.get(`http://localhost:8090/api/job-applications/downloadCV/${job_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      // Tạo URL từ dữ liệu blob để tải xuống
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cvs_${job_id}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      console.log(`CVs for Job ID ${job_id} downloaded successfully!`);
    } catch (error) {
      // Kiểm tra lỗi từ backend
      const errorMessage = error.response?.data?.message || "Unable to download CVs. Please try again later.";
  
      // Hiển thị thông báo lỗi từ backend
      toast.error(errorMessage);
  
      console.error("Error downloading CVs:", error);
    }
  };
  
  const handleClose = async (jobId) => {
    console.log("Closing job with ID:", jobId);
    try {
      await axios.put(
        `http://localhost:8090/api/admin/jobs/close/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchJobs();
    } catch (error) {
      console.error("Error closing job:", error);
      toast.error(error.response.data.message || "Failed to close the job.");
    }
  }

  return (
    <div>
      {/* Header Section */}
      <div className="bg-primary text-white text-center py-3 mb-4">
        <h3>Manage Jobs</h3>
        <p className="mb-0">Create, edit, and manage your job postings</p>
      </div>

      {/* Main Content */}
      <div className="p-3 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control me-3"
            style={{ maxWidth: "300px" }}
            placeholder="Search jobs by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link to="/recruiter/create-job" className="btn btn-primary">
            Create New Job
          </Link>
        </div>


        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Job Title</th>
              <th>Applications</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
              <th className="text-center">Download</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr key={job.id} style={{ verticalAlign: "middle" }}>
                  <td>
  <Link to={`/recruiter/jobs/${job.id}/candidates`} className="text-decoration-none">
    {job.title}
  </Link>
</td>

                  <td>{job.applications}</td>
                  <td>
                  <span
            className={`badge ${
              job.status === "OPEN"
                ? "bg-success"
                : job.status === "CLOSED"
                ? "bg-secondary"
                : job.status === "PENDING"
                ? "bg-warning"
                : job.status === "REJECTED"
                ? "bg-secondary"
                : ""
            }`}
          >
            {job.status}
          </span>
                  </td>
                  <td className="d-flex justify-content-center gap-2">
                    <Link
                      to={`/recruiter/jobs/edit/${job.id}`}
                      className="btn btn-warning btn-sm"
                    >
                      Edit
                    </Link>
                    <button
    className="btn btn-secondary btn-sm"
    onClick={() => handleClose(job.id)} 
  >
    Close
  </button>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => handleDownloadCVs(job.id)}
                      title="Download CVs"
                    >
                      <FaDownload />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end align-items-center mt-3">
        <label className="me-2 mb-0">Jobs per page:</label>
        <select
          className="form-select form-select-sm"
          style={{ width: "100px" }}
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
