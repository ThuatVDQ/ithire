import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import about3 from "../assets/images/about/ab03.jpg";
import about4 from "../assets/images/about/ab04.jpg";

import ModalVideo from "react-modal-video";
import "../../node_modules/react-modal-video/scss/modal-video.scss";

import companyApi from "../api/companyApi";

export default function Companies() {
  const [isOpen, setOpen] = useState(false);
  const [companies, setCompanies] = useState([]);

  // Gọi API để lấy danh sách công ty
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyApi.getAllCompanies({
          page: 1,
          limit: 6,
        });
        setCompanies(response.companies);
      } catch (err) {
        console.error("Error fetching companies:", err.message);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="row g-4 align-items-center">
      <div className="col-lg-6 col-md-6 mb-5 order-md-2 order-1">
        <div className="about-right">
          <div className="position-relative shadow rounded img-one">
            <img src={about3} className="img-fluid rounded" alt="" />
          </div>

          <div className="img-two shadow rounded p-2 bg-white">
            <img src={about4} className="img-fluid rounded" alt="" />

            <div className="position-absolute top-0 start-50 translate-middle">
              <Link
                to="#!"
                onClick={() => setOpen(true)}
                className="avatar avatar-md-md rounded-pill shadow card d-flex justify-content-center align-items-center lightbox"
              >
                <i className="mdi mdi-play mdi-24px text-primary"></i>
              </Link>
            </div>
            <ModalVideo
              channel="youtube"
              youtube={{ mute: 0, autoplay: 0 }}
              isOpen={isOpen}
              videoId="yba7hPeTSjk"
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      </div>

      <div className="col-lg-6 col-md-6 mt-4 pt-2 mt-sm-0 pt-sm-0 order-md-1 order-2">
        <div className="section-title mb-4 me-lg-5">
          <h4 className="title mb-3">Find Best Companies.</h4>
          <p className="text-muted para-desc mb-0">
            Search all the open positions on the web. Get your own personalized
            salary estimate. Read reviews on over 30000+ companies worldwide.
          </p>
        </div>

        <div className="row g-4 mt-0">
          {companies.map((company, index) => (
            <div className="col-md-6" key={index}>
              <div className="employer-card rounded shadow p-2 bg-light">
                <div className="d-flex align-items-center">
                  <img
                    src={`http://localhost:8090${company.logo}`}
                    className="avatar avatar-md-sm rounded shadow p-2 bg-white"
                    alt=""
                  />

                  <div className="content ms-3">
                    <Link
                      to={`/company-detail/${company.company_id}`}
                      className="h5 title text-dark"
                    >
                      {company.name}
                    </Link>
                    <span className="text-muted d-flex align-items-center small mt-1">
                      {company.totalJobs || 0} vacancy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Link to="/companies" className="btn btn-link primary text-muted">
            See More Companies{" "}
            <i className="mdi mdi-arrow-right align-middle"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
