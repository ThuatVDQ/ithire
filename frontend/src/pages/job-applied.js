import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import jobApplicationApi from "../api/jobApplicationApi";
import jobApi from "../api/jobApi";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";
import bg1 from "../assets/images/hero/bg4.jpg";

export default function JobApplied() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await jobApplicationApi.getUserApplications();
        console.log(data);
        setApplications(data.applications);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to fetch job applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleFileChange = async (event, jobId) => {
    const cvFile = event.target.files[0];
    if (!cvFile) {
      toast.error("Please select a CV file.");
      return;
    }

    const formData = new FormData();
    formData.append("cv", cvFile);

    setApplying(true);
    setSelectedJobId(jobId);

    try {
      await jobApi.applyJob(jobId, formData);
      toast.success("CV updated successfully!");
      // Refresh the applications list
      const data = await jobApplicationApi.getUserApplications();
      setApplications(data.applications);
    } catch (error) {
      console.error("Error updating CV:", error);
      toast.error("Failed to update CV.");
    } finally {
      setApplying(false);
      setSelectedJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="container text-center my-5">
        <h2>You haven’t applied for any jobs yet!</h2>
        <p className="text-muted">
          Explore opportunities and start applying for jobs today.
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
                  Applied Jobs
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          <div className="row">
            {applications.map((app) => (
              <div className="col-12 mb-3" key={app.application_id}>
                <div className="card shadow-sm border-0 p-3">
                  <div className="d-flex align-items-start">
                    <img
                      src={app.job?.company?.logo || "/default-logo.png"}
                      alt={app.job?.company?.name || "Company Logo"}
                      className="rounded me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "contain",
                      }}
                    />
                    <div className="flex-grow-1">
                      <Link
                        to={`/jobs/${app.job_id}`}
                        className="text-dark title h5"
                      >
                        {app.job?.title || "N/A"}
                      </Link>
                      <Link
                        to={`/company-detail/${app.job.company?.company_id}`}
                        className="text-muted small d-block mt-1"
                      >
                        <strong>{app.job?.company?.name || "N/A"}</strong>
                      </Link>
                      <p className="text-muted mb-2">
                        <strong>Applied on:</strong>{" "}
                        {new Date(app.createdAt).toLocaleDateString()}{" "}
                        {new Date(app.createdAt).toLocaleTimeString()}
                      </p>
                      <p className="text-muted mb-0">
                        <strong>Uploaded CV:</strong>{" "}
                        <a
                          href={`http://localhost:8090/uploads/${app.cv?.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary"
                        >
                          View CV
                        </a>
                      </p>
                      {app.status === "REJECTED" && (
                        <p className="text-danger mt-2">
                          Application not suitable (
                          {new Date(app.updatedAt).toLocaleDateString()} )
                        </p>
                      )}
                      {app.status === "SEEN" && (
                        <p className="text-success mt-2">
                          Recruiter viewed application (
                          {new Date(app.updatedAt).toLocaleDateString()} )
                        </p>
                      )}
                      {app.status === "IN_PROGRESS" && (
                        <p className="text-warning mt-2">
                          Application in progress (
                          {new Date(app.updatedAt).toLocaleDateString()} )
                        </p>
                      )}
                    </div>
                    <div className="d-flex flex-column justify-content-center mt-3">
                      <div className="mb-2">
                        <label
                          className="btn btn-outline-primary btn-sm mb-2"
                          htmlFor={`update-cv-${app.job_id}`}
                        >
                          Update CV
                        </label>
                        <input
                          type="file"
                          id={`update-cv-${app.job_id}`}
                          className="d-none"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(e, app.job_id)}
                        />
                      </div>
                      <Link
                        to={`/jobs/${app.job?.job_id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        View Job
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <ScrollTop />
    </>
  );
}
