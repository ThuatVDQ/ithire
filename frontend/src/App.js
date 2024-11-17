import React from "react";
import { Route, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/style.scss";
import "./assets/css/materialdesignicons.min.css";
import Home from "./pages/home";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import LoginRecruiter from "./pages/login/loginAsEn";
import SignupRecruiter from "./pages/signup/signupAsEn";
import RecruiterLayout from "./pages/recruiter/layout";
import Dashboard from "./pages/recruiter/dashboard";
import JobManagement from "./pages/recruiter/jobManagement";
import ProfileManagement from "./pages/recruiter/profileManagement";
import CreateJob from "./pages/recruiter/createJob";
import JobCandidates from "./pages/recruiter/jobCandidates";

import Companies from "./pages/company";
import Job from "./pages/job";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<Job />} />
        <Route path="/companies" element={<Companies />}></Route>
        <Route path="/recruiter/login" element={<LoginRecruiter />} />
        <Route path="/recruiter/signup" element={<SignupRecruiter />} />
        <Route path="/recruiter" element={<RecruiterLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<JobManagement />} />
          <Route path="profile" element={<ProfileManagement />} />
          <Route path="create-job" element={<CreateJob />} />
          <Route path="jobs/:jobId/candidates" element={<JobCandidates />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
