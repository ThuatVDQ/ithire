import React from "react";
import { Link } from "react-router-dom";

import bg1 from "../assets/images/hero/bg.jpg";

import Navbar from "../components/navbar";
import Faq from "../components/faq";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

import companyApi from "../api/companyApi";
import { useState, useEffect } from "react";

import { FiMapPin } from "../assets/icons/vander";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyApi.getAllCompanies({
          page: currentPage,
          limit: 8,
        });
        setCompanies(response.companies);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Error fetching companies:", error.message);
      }
    };

    fetchCompanies();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

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
                  Companies
                </h5>
              </div>
            </div>
          </div>

          <div className="position-middle-bottom">
            <nav aria-label="breadcrumb" className="d-block">
              <ul className="breadcrumb breadcrumb-muted mb-0 p-0">
                <li className="breadcrumb-item">
                  <Link to="/">ItHire</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Companies
                </li>
              </ul>
            </nav>
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
          <div className="row g-4 gy-5">
            {companies.map((company, index) => (
              <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={index}>
                <div className="employer-card position-relative bg-white rounded shadow p-4 mt-3 h-100 d-flex flex-column">
                  <div className="employer-img d-flex justify-content-center align-items-center bg-white shadow-md rounded">
                    <img
                      src={`http://localhost:8090${company.logo}`}
                      className="avatar avatar-ex-small"
                      alt={company.name}
                    />
                  </div>
                  <div className="content mt-3 flex-grow-1">
                    <Link
                      to={`/company-detail/${company.company_id}`}
                      className="title text-dark h5"
                    >
                      {company.name}
                    </Link>
                    <p className="text-muted mt-2 mb-0">
                      {company.description || "No description available"}
                    </p>
                  </div>
                  <ul className="list-unstyled border-top mt-3 pt-3 mb-0">
                    <li className="d-flex flex-column">
                      <div className="text-muted d-flex align-items-center mb-2">
                        <FiMapPin className="fea icon-sm me-1 align-middle" />
                        {company.address || "Unknown"}
                      </div>
                      <div className="list-inline-item text-primary fw-medium">
                        {company.totalJobs} Jobs
                      </div>
                    </li>
                  </ul>
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
        <div className="container mt-100 mt-60">
          <Faq />
        </div>
      </section>
      <Footer top={true} />
      <ScrollTop />
    </>
  );
}
