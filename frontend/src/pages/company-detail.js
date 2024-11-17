import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import bg1 from "../assets/images/hero/bg4.jpg";
import logo1 from "../assets/images/company/lenovo-logo.png";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiDribbble,
  FiLinkedin,
  FiFacebook,
  FiInstagram,
  FiTwitter,
} from "../assets/icons/vander";

import companyApi from "../api/companyApi";

export default function CompanyDetail() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await companyApi.getCompanyDetail(companyId);
        setCompany(data.company);
        setJobs(data.jobs);

        setLoading(false);
      } catch (err) {
        setError("Failed to load company details.");
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Navbar navClass="defaultscroll sticky" navLight={true} />
      <section
        className="bg-half-170 d-table w-100"
        style={{ backgroundImage: `url(${bg1})`, backgroundPosition: "center" }}
      >
        <div className="bg-overlay bg-gradient-overlay-2"></div>
      </section>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="features-absolute">
              <div className="d-md-flex justify-content-between align-items-center bg-white shadow rounded p-4">
                <div className="d-flex align-items-center">
                  <img
                    src={company?.logo || logo1}
                    className="avatar avatar-md-md rounded shadow p-3 bg-white"
                    alt={company?.name || "Company Logo"}
                  />
                  <div className="ms-3">
                    <h5>{company?.name || "No company name"}</h5>
                    <span className="text-muted d-flex align-items-center">
                      <FiMapPin className="fea icon-sm me-1" />
                      {company?.address || "Address not available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8 col-md-7 col-12">
              <h4 className="mb-4">Company Story:</h4>
              <p className="text-muted">
                {company?.description || "No description available."}
              </p>

              <h4 className="my-4">Vacancies:</h4>
              <div className="row g-4">
                {jobs.map((job, index) => (
                  <div className="col-lg-6 col-12" key={index}>
                    <div className="job-post rounded shadow bg-white">
                      <div className="p-4">
                        <Link
                          to={`/job-detail-one/${job.id}`}
                          className="text-dark title h5"
                        >
                          {job.title}
                        </Link>

                        <p className="text-muted d-flex align-items-center small mt-3">
                          <FiClock className="fea icon-sm text-primary me-1" />
                          Posted {job.postedDays} days ago
                        </p>

                        <ul className="list-unstyled d-flex justify-content-between align-items-center mb-0 mt-3">
                          <li className="list-inline-item">
                            <span className="badge bg-soft-primary">
                              {job.type}
                            </span>
                          </li>
                          <li className="list-inline-item">
                            <span className="text-muted d-flex align-items-center small">
                              {job.salary_end} {job.currency}/month
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4 col-md-5 col-12">
              <div className="card bg-white p-4 rounded shadow sticky-bar">
                <div className="map map-400px border-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39206.002432144705!2d-95.4973981212445!3d29.709510002925988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c16de81f3ca5%3A0xf43e0b60ae539ac9!2sGerald+D.+Hines+Waterwall+Park!5e0!3m2!1sen!2sin!4v1566305861440!5m2!1sen!2sin"
                    className="rounded"
                    style={{ border: "0" }}
                    title="ItHire"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="mt-3">
                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <span className="text-muted fw-medium">Headquarters:</span>
                    <span>{company.address}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <span className="text-muted fw-medium">Phone number:</span>
                    <span>{company.phone}</span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <span className="text-muted fw-medium">
                      Number of employees:
                    </span>
                    <span>{company.scale} +</span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <span className="text-muted fw-medium">Website:</span>
                    <span>{company.web_url}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer top={true} />
      <ScrollTop />
    </>
  );
}
