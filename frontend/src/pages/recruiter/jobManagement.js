import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchQuery]);

  // Fetch jobs from the backend
  const fetchJobs = async () => {
    try {
      const response = await axios.get("/api/recruiter/jobs", {
        params: {
          page: currentPage,
          search: searchQuery,
        },
      });
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div
        className="bg-primary text-white text-center py-3 mb-4"
      >
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
          <Link to="/recruiter/jobs/create" className="btn btn-primary">
            Create New Job
          </Link>
        </div>

        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Job Title</th>
              <th>Applications</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.applications}</td>
                  <td>
                    <span
                      className={`badge ${
                        job.status === "Active"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/recruiter/jobs/edit/${job.id}`}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button className="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  <button className="page-link">{i + 1}</button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
