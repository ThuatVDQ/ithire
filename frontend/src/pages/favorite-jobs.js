import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import jobApi from "../api/jobApi";
import authApi from "../api/authApi";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import bg1 from "../assets/images/hero/bg4.jpg";
import { formatDistanceToNow, parseISO } from "date-fns";
export default function FavoriteJobs() {
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchFavoriteJobs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await jobApi.getFavoriteJobs({ page, limit: 6 });
      setFavoriteJobs(response.favoriteJobs);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching favorite jobs:", error.message);
      toast.error("Failed to fetch favorite jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to manage favorites.");
        return;
      }
      await authApi.removeFavoriteJob(jobId, token);
      toast.success("Removed from favorites.");
      // Refresh the favorite jobs list
      fetchFavoriteJobs(currentPage);
    } catch (error) {
      console.error("Error removing favorite job:", error.message);
      toast.error("Failed to remove job from favorites.");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
      fetchFavoriteJobs(page);
    }
  };

  useEffect(() => {
    fetchFavoriteJobs();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (favoriteJobs.length === 0) {
    return (
      <div className="container text-center my-5">
        <h2>No Favorite Jobs Found!</h2>
        <p className="text-muted">
          Start exploring and save jobs to your favorites.
        </p>
        <Link to="/jobs" className="btn btn-primary">
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar navClass="defaultscroll sticky" navLight={true} />
      <section
        className="bg-half-170 d-table w-100"
        style={{
          backgroundImage: `url(${bg1})`,
          backgroundPosition: "top",
        }}
      >
        <div className="bg-overlay bg-gradient-overlay"></div>
        <div className="container">
          <div className="row mt-5 justify-content-center">
            <div className="col-12">
              <div className="title-heading text-center">
                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
                  Favorite Jobs
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {favoriteJobs.map((job) => (
              <div className="col-12 mb-3" key={job.job_id}>
                <div className="card shadow-sm border-0 p-3">
                  <div className="d-flex align-items-start">
                    <img
                      src={job?.companyLogo || "/default-logo.png"}
                      alt={job?.companyName || "Company Logo"}
                      className="rounded me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "contain",
                      }}
                    />
                    <div className="flex-grow-1">
                      <Link
                        to={`/jobs/${job.job_id}`}
                        className="text-dark title h5"
                      >
                        {job.title || "N/A"}
                      </Link>
                      <Link
                        to={`/company-detail/${job?.company_id}`}
                        className="text-muted small d-block mt-1"
                      >
                        <strong>{job?.companyName || "N/A"}</strong>
                      </Link>
                      <p className="text-muted mb-2">
                        <strong>Location:</strong> {job.addresses[0] || "N/A"}
                      </p>
                      <p className="text-muted mb-2">
                        <strong>Deadline:</strong>{" "}
                        {new Date(job.deadline).toLocaleDateString() + " - "}
                        {formatDistanceToNow(parseISO(job.deadline), {
                          addSuffix: true,
                        }) + " left"}{" "}
                      </p>
                    </div>
                    <div className="d-flex flex-column justify-content-center">
                      <Link
                        to={`/jobs/${job.job_id}`}
                        className="btn btn-outline-primary btn-sm mb-2"
                      >
                        View Job
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemoveFavorite(job.job_id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row">
            <div className="col-12 mt-4 pt-2">
              <ul className="pagination justify-content-center mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <Link className="page-link" to="#">
                    <i className="mdi mdi-chevron-left fs-6"></i>
                  </Link>
                </li>
                {Array.from({ length: pagination.totalPages || 1 }).map(
                  (_, index) => (
                    <li
                      className={`page-item ${
                        index + 1 === currentPage ? "active" : ""
                      }`}
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      <Link className="page-link" to="#">
                        {index + 1}
                      </Link>
                    </li>
                  )
                )}
                <li
                  className={`page-item ${
                    currentPage === pagination.totalPages ? "disabled" : ""
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <Link className="page-link" to="#">
                    <i className="mdi mdi-chevron-right fs-6"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ScrollTop />
    </>
  );
}
