import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import jobApi from "../api/jobApi"; // Import your jobApi
import jobApplicationApi from "../api/jobApplicationApi"; // Import the API for job applications

import logo1 from "../assets/images/company/lenovo-logo.png";
import bg1 from "../assets/images/hero/bg4.jpg";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import { parseISO, format } from "date-fns";

import {
  FiLayout,
  FiMapPin,
  FiUserCheck,
  FiClock,
  FiMonitor,
  FiBriefcase,
  FiBook,
  FiDollarSign,
  FiArrowRight,
} from "../assets/icons/vander";

export default function JobDetail() {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cvFile, setCvFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const data = await jobApi.getJobDetail(jobId);
        setJobData(data);

        const applicationStatus = await jobApplicationApi.checkJobApplication(
          jobId
        );
        setHasApplied(applicationStatus.applied);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to fetch job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  const handleFileChange = (event) => {
    setCvFile(event.target.files[0]);
  };

  const handleApplyJob = async () => {
    if (!cvFile) {
      toast.error("Please upload your CV before applying.");
      return;
    }

    const formData = new FormData();
    formData.append("cv", cvFile);

    setApplying(true);

    try {
      await jobApi.applyJob(jobId, formData);
      toast.success("Job application submitted successfully!");
      setHasApplied(true); // Update the state to reflect the application
    } catch (error) {
      toast.error("Failed to apply for the job.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div>Loading job details...</div>;
  }

  if (!jobData) {
    return <div>Job not found!</div>;
  }

  const { job, company, skills, addresses } = jobData;

  return (
    <>
      <Navbar navClass="defaultscroll sticky" navLight={true} />
      <section
        className="bg-half-170 d-table w-100"
        style={{ backgroundImage: `url(${bg1})`, backgroundPosition: "center" }}
      >
        <div className="bg-overlay bg-gradient-overlay-2"></div>
      </section>
      <section>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8 col-md-6 col-12">
              <div className="d-lg-flex align-items-center p-4 rounded shadow bg-white mb-4">
                <img
                  src={company?.logo || logo1}
                  className="avatar avatar-medium p-4 rounded-pill shadow bg-white"
                  alt=""
                />
                <div className="ms-lg-3 mt-3 mt-lg-0">
                  <h4>{job?.title || "Back-End Developer"}</h4>
                  <ul className="list-unstyled mb-0">
                    <li className="d-inline-flex align-items-center text-muted me-2">
                      <FiLayout className="fea icon-sm text-primary me-1" />{" "}
                      {company?.name || "Lenovo"}
                    </li>
                    <li className="d-inline-flex align-items-center text-muted">
                      <FiMapPin className="fea icon-sm text-primary me-1" />
                      {addresses?.[0]?.city || "Beijing"},{" "}
                      {addresses?.[0]?.country || "China"}
                    </li>
                  </ul>
                </div>
              </div>

              <h5>Job Description: </h5>
              <p className="text-muted">{job?.description || "N/A"}</p>

              <h5 className="mt-4">Requirement: </h5>
              <p className="text-muted">{job?.requirement || "N/A"}</p>

              <h5 className="mt-4">Benefit:</h5>
              <p className="text-muted">{job?.benefit || "N/A"}</p>
              <div className="mt-4">
                <input
                  className="form-control"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={applying}
                />
              </div>

              {/* Apply Button */}
              <div className="mt-4">
                <button
                  className="btn btn-outline-primary"
                  onClick={handleApplyJob}
                  disabled={applying}
                >
                  {applying
                    ? "Submitting..."
                    : hasApplied
                    ? "Change CV"
                    : "Apply Now"}
                  <i className="mdi mdi-send"></i>
                </button>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-12">
              <div className="card bg-white rounded shadow sticky-bar">
                <div className="p-4">
                  <h5 className="mb-0">Job Information</h5>
                </div>
                <div className="card-body p-4 border-top">
                  <div className="d-flex widget align-items-center">
                    <FiLayout className="fea icon-ex-md me-3" />
                    <div className="flex-1">
                      <h6 className="widget-title mb-0">Location</h6>
                      <p>{addresses?.[0]?.city || "N/A"}</p>
                    </div>
                  </div>
                  <div className="d-flex widget align-items-center">
                    <FiBriefcase className="fea icon-ex-md me-3" />
                    <div className="flex-1">
                      <h6 className="widget-title mb-0">Employment Type</h6>
                      <p>{job?.employmentType || "Full-time"}</p>
                    </div>
                  </div>
                  <div className="d-flex widget align-items-center">
                    <FiDollarSign className="fea icon-ex-md me-3" />
                    <div className="flex-1">
                      <h6 className="widget-title mb-0">Salary</h6>
                      <p>
                        {job.salary_start} - {job.salary_end} {job.currency}
                        /month
                      </p>
                    </div>
                  </div>
                  <div className="d-flex widget align-items-center">
                    <FiClock className="fea icon-ex-md me-3" />
                    <div className="flex-1">
                      <h6 className="widget-title mb-0">Posted On</h6>
                      <p>{format(parseISO(job.createdAt), "dd/MM/yyyy")}</p>
                    </div>
                  </div>
                  <div className="d-flex widget align-items-center">
                    <FiMonitor className="fea icon-ex-md me-3" />
                    <div className="flex-1">
                      <h6 className="widget-title mb-0">Skills</h6>
                      <p>
                        {skills.map((skill) => skill.name).join(", ") || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex widget align-items-center">
                    <FiBriefcase className="fea icon-ex-md me-3" />
                    <div className="flex-1">
                      <h6 className="widget-title mb-0">Experience</h6>
                      <p>{job?.experience || "N/A"}</p>
                    </div>
                  </div>

                  <div className="d-flex widget align-items-center">
                    <FiUserCheck className="fea icon-ex-md me-3" />
                    <div className="flex-1">
                      <h6 className="widget-title mb-0">Available Slots</h6>
                      <p>{job?.slots || "N/A"}</p>
                    </div>
                  </div>

                  <div className="d-flex widget align-items-center">
                    <FiBriefcase className="fea icon-ex-md me-3" />
                    <div className="flex-1">
                      <h6 className="widget-title mb-0">Position</h6>
                      <p>{job?.position || "N/A"}</p>
                    </div>
                  </div>

                  <div className="d-flex widget align-items-center">
                    <FiUserCheck className="fea icon-ex-md me-3" />
                    <div className="flex-1">
                      <h6 className="widget-title mb-0">Job Level</h6>
                      <p>{job?.level || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ScrollTop />
    </>
  );
}
