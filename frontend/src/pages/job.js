import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import bg1 from "../assets/images/hero/bg.jpg";

import Navbar from "../components/navbar";
import AboutTwo from "../components/aboutTwo";
import FormSelect from "../components/formSelect";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import jobApi from "../api/jobApi";
import authApi from "../api/authApi"; // Import API auth

import { FiBookmark, FiArrowUpRight, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Job() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const handleFavoriteJob = async (jobId, isFavorite) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to manage favorites.");
        return;
      }

      if (isFavorite) {
        await authApi.removeFavoriteJob(jobId, token);
        toast.success("Removed from favorites.");
      } else {
        await authApi.addFavoriteJob(jobId, token);
        toast.success("Added to favorites.");
      }

      // Cập nhật trạng thái công việc
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.job_id === jobId ? { ...job, isFavorite: !isFavorite } : job
        )
      );
    } catch (error) {
      console.error("Error managing favorite job:", error.message);
      toast.error("Failed to update favorites.");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = async ({ keyword, location, type }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await jobApi.searchJobs(
        {
          page: 1, 
          limit: 6,
          keyword,
          location,
          type,
        },
        token
      );

      setJobs(response.jobs);
      setPagination(response.pagination);
      setCurrentPage(1); // Đặt lại trang hiện tại về 1
    } catch (error) {
      console.error("Error searching jobs:", error.message);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await jobApi.getAllJobs(
          { page: currentPage, limit: 6 },
          token
        );
        setJobs(response.jobs);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
      }
    };

    fetchJobs();
  }, [currentPage]);

  return (
    <>
      <Navbar navClass="defaultscroll sticky" navLight={true} />
      <section
        className="bg-half-170 d-table w-100"
        style={{ backgroundImage: `url(${bg1})`, backgroundPosition: "top" }}
      >
        <div className="bg-overlay bg-gradient-overlay"></div>
        <div className="container">
          <div className="row mt-5 justify-content-center">
            <div className="col-12">
              <div className="title-heading text-center">
                <h5 className="heading fw-semibold mb-0 sub-heading text-white title-dark">
                  Job Vacancies
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="position-relative">
        <div className="shape overflow-hidden text-white">
          <svg
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 mt-4">
              <div className="features-absolute">
                <div className="d-md-flex justify-content-between align-items-center bg-white shadow rounded p-4">
                  <FormSelect onSearch={handleSearch} /> {/* Truyền hàm onSearch */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-60">
          <div className="row g-4">
            {jobs.map((item, index) => (
              <div className="col-lg-4 col-md-6 col-12" key={index}>
                <div className="job-post job-type-three rounded shadow bg-white p-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <img
                        src={item.companyLogo}
                        className="avatar avatar-small rounded shadow p-3 bg-white"
                        alt=""
                      />
                    </div>

                    <ul className="list-unstyled align-items-center mb-0">
                      <li className="list-inline-item">
                        <button
                          className={`btn btn-icon btn-sm ${
                            item.isFavorite
                              ? "btn-soft-success"
                              : "btn-soft-primary"
                          }`}
                          onClick={() =>
                            handleFavoriteJob(item.job_id, item.isFavorite)
                          }
                        >
                          {item.isFavorite ? <FiCheck /> : <FiBookmark />}
                        </button>
                      </li>
                      <li className="list-inline-item">
                        <Link
                          to=""
                          className="btn btn-icon btn-sm btn-soft-primary"
                        >
                          <FiArrowUpRight className="icons" />
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-2">
                    <Link
                      to={`/job-detail/${item.job_id}`}
                      className="text-dark title h5"
                    >
                      {item.title} - Up to {item.salary_end} {item.currency}
                    </Link>
                    <Link
                      to={`/companies/${item.company_id}`}
                      className="text-muted small d-block mt-1"
                    >
                      {item.companyName}
                    </Link>
                    <p className="text-muted mt-2">{item.description}</p>

                    <ul className="list-unstyled mb-0">
                      <li className="d-inline-block me-1">
                        <span className="badge bg-primary">{item.type}</span>
                      </li>

                      <li className="d-inline-block me-1">
                        <span className="badge bg-primary">
                          <i className="mdi mdi-map-marker me-1"></i>
                          {item.addresses[0]}
                        </span>
                      </li>
                      {item.skills.slice(0, 2).map((skill, index) => (
                        <li className="d-inline-block me-1" key={index}>
                          <span className="badge bg-secondary">{skill}</span>
                        </li>
                      ))}
                    </ul>
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
        <AboutTwo />
      </section>
      <Footer top={true} />
      <ScrollTop />
    </>
  );
}
