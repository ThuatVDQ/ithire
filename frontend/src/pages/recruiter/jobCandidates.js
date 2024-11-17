import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function JobApplications() {
  const { jobId } = useParams(); // Lấy jobId từ URL
  const [jobTitle, setJobTitle] = useState(""); // Tiêu đề công việc
  const [applications, setApplications] = useState([]); // Danh sách ứng viên
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [pageSize, setPageSize] = useState(10); // Số bản ghi mỗi trang

  useEffect(() => {
    fetchJobApplications();
  }, [currentPage, pageSize]);

  const fetchJobApplications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8090/api/job-applications/${jobId}`,
        {
          params: {
            page: currentPage,
            limit: pageSize,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { job, applications, pagination } = response.data;
      setJobTitle(job.title); // Cập nhật tiêu đề công việc
      setApplications(applications); // Cập nhật danh sách ứng viên
      setTotalPages(pagination.totalPages); // Tổng số trang
    } catch (error) {
        if (error.response.data.message === "Invalid token.") {
            localStorage.removeItem("token");
            window.location.href = "/recruiter/login";
            toast.error("Your session has expired. Please log in again.");
            } else {

      console.error("Error fetching job applications:", error);
    }}
  };

  const handleDownloadCV = async (cvid, user, id) => {
    try {
      const response = await axios.get(
        `http://localhost:8090/api/cvs/downloadCV/${cvid}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cv_${user}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      changeApplicationStatus(id, "SEEN");
    } catch (error) {
      console.error("Error downloading CV:", error);
    }
  };

  const handleViewCV = (cv_url, id) => {
    // Logic xem CV (ví dụ mở CV trong tab mới)
    window.open(`http://localhost:8090/uploads/${cv_url}`, "_blank");
    changeApplicationStatus(id, "SEEN");
  };


  const changeApplicationStatus = async (jobApplicationId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8090/api/job-applications/change-status/${jobApplicationId}`,
        { newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message || "Application status updated successfully.");
      fetchJobApplications(); 
    } catch (error) {
      console.error("Error changing application status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update application status. Please try again later."
      );
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-primary text-white text-center py-3 mb-4">
        <h3>Applications for Job: {jobTitle}</h3>
      </div>

      <div className="mb-3 ms-3">
  <button
    className="btn btn-secondary"
    onClick={() => window.history.back()}
  >
    Back
  </button>
</div>


      {/* Applications Table */}
      <div className="p-3 bg-light rounded shadow-sm">
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Candidate Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th className="text-center">CV Actions</th>
              <th className="text-center">Status Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app, index) => (
                <tr key={app.id}>
                  <td>{index + 1 + (currentPage - 1) * pageSize}</td>
                  <td>{app.user?.full_name || "N/A"}</td>
                  <td>{app.user?.email || "N/A"}</td>
                  <td>{app.user?.phone || "N/A"}</td>
                  <td>
                    <span
                      className={`badge ${
                        app.status === "Pending"
                          ? "bg-warning"
                          : app.status === "Accepted"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleViewCV(app.cv_url, app.id)}
                    >
                      View CV
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleDownloadCV(app.cv_id, app.user.full_name, app.id)}
                    >
                      Download CV
                    </button>
                  </td>
                  <td className="text-center">
                    {app.status === "SEEN" && (
                      <>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() =>
                            changeApplicationStatus(app.id, "ACCEPTED")
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            changeApplicationStatus(app.id, "REJECTED")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
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
        </div>
      )}
    </div>
  );
}
