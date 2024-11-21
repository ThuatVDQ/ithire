import React from "react";
import { Link } from "react-router-dom";

import heroImg from "../assets/images/hero/bg.jpg";

import Navbar from "../components/navbar";
import FormSelect from "../components/formSelect";
import ServicesTwo from "../components/sercicesTwo";
import AboutUs from "../components/aboutUs";
import Companies from "../components/companies";
import Blog from "../components/blog";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import jobApi from "../api/jobApi";
import { FiClock, FiMapPin, FiBookmark } from "../assets/icons/vander";
import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO, format } from "date-fns";
export default function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobApi.getAllJobs({ page: 1, limit: 8 });
        setJobs(response.jobs);
      } catch (err) {
        console.error("Error fetching jobs:", err.message);
      }
    };

    fetchJobs();
  }, []);

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
    } catch (error) {
      console.error("Error searching jobs:", error.message);
    }
  };

  return (
    <>
      <Navbar navClass="defaultscroll sticky" navLight={true} />
      <section
        className="bg-half-260 d-table w-100"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="bg-overlay bg-primary-gradient-overlay"></div>
        <div className="container">
          <div className="row mt-5 justify-content-center">
            <div className="col-lg-10">
              <div className="title-heading text-center">
                <h1 className="heading text-white fw-bold">
                  Find & Hire Experts <br /> for any Job
                </h1>
                <p className="para-desc text-white-50 mx-auto mb-0">
                  Find Jobs, Employment & Career Opportunities. Some of the
                  companies we've helped recruit excellent applicants over the
                  years.
                </p>

                <div className="d-md-flex justify-content-between align-items-center bg-white shadow rounded p-2 mt-4">
                  <FormSelect onSearch={handleSearch} />
                </div>

                <div className="mt-2">
                  <span className="text-white-50">
                    <span className="text-white">Popular Searches :</span>{" "}
                    Designer, Developer, Web, IOS, PHP Senior Engineer
                  </span>
                </div>
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
          <div className="row justify-content-center mb-4 pb-2">
            <div className="col-12">
              <div className="section-title text-center">
                <h4 className="title mb-3">Trending Services</h4>
                <p className="text-muted para-desc mx-auto mb-0">
                  Search all the open positions on the web. Get your own
                  personalized salary estimate. Read reviews on over 30000+
                  companies worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* <ServicesTwo/> */}
        </div>
        <AboutUs containerClass="container mt-100 mt-60" />

        <div className="container mt-100 mt-60">
          <div className="row justify-content-center mb-4 pb-2">
            <div className="col-12">
              <div className="section-title text-center">
                <h4 className="title mb-3">Popular Job Listing</h4>
                <p className="text-muted para-desc mx-auto mb-0">
                  Search all the open positions on the web. Get your own
                  personalized salary estimate. Read reviews on over 30000+
                  companies worldwide.
                </p>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-0">
            {jobs.slice(0, 8).map((item, index) => {
              return (
                <div className="col-12" key={index}>
                  <div className="job-post job-post-list rounded shadow p-4 d-md-flex align-items-center justify-content-between position-relative">
                    <div className="d-flex align-items-center w-310px">
                      <img
                        src={`http://localhost:8090${item.companyLogo}`}
                        className="avatar avatar-small rounded shadow p-3 bg-white"
                        alt=""
                      />

                      <div className="ms-3">
                        <Link
                          to={`/jobs/${item.job_id}`}
                          className="h5 title text-dark"
                        >
                          {item.title}
                        </Link>
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between d-md-block mt-3 mt-md-0 w-100px">
                      <span className="badge bg-soft-primary rounded-pill">
                        {format(parseISO(item.deadline), "dd/MM/yyyy")}
                      </span>
                      <span className="text-muted d-flex align-items-center fw-medium mt-md-2">
                        <FiClock className="fea icon-sm me-1 align-middle" />
                        {formatDistanceToNow(parseISO(item.createdAt), {
                          addSuffix: true,
                        })}{" "}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between d-md-block mt-2 mt-md-0 w-130px">
                      <span className="text-muted d-flex align-items-center">
                        <FiMapPin className="fea icon-sm me-1 align-middle" />
                        {item.addresses[0]}
                      </span>
                      <span className="d-flex fw-medium mt-md-2">
                        {item.salary_start} - {item.salary_end}
                      </span>
                    </div>

                    <div className="mt-3 mt-md-0">
                      <Link
                        to=""
                        className="btn btn-sm btn-icon btn-pills btn-soft-primary bookmark"
                      >
                        <FiBookmark className="icons" />
                      </Link>
                      <Link
                        to={`/jobs/${item.job_id}`}
                        className="btn btn-sm btn-primary w-full ms-md-1"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="col-12">
              <div className="text-center">
                <Link to="/jobs" className="btn btn-link primary text-muted">
                  See More Jobs <i className="mdi mdi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-100 mt-60">
          <Companies />
        </div>

        <div className="container mt-100 mt-60">
          <div className="row justify-content-center">
            <div className="col">
              <div className="section-title text-center mb-4 pb-2">
                <h4 className="title mb-3">Latest Blog or News</h4>
                <p className="text-muted para-desc mb-0 mx-auto">
                  Search all the open positions on the web. Get your own
                  personalized salary estimate. Read reviews on over 30000+
                  companies worldwide.
                </p>
              </div>
            </div>
          </div>

          <Blog />
        </div>
      </section>
      <Footer />
      <ScrollTop />
    </>
  );
}
