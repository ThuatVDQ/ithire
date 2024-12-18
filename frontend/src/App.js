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
import AccountManagement from "./pages/recruiter/accountManagement";
import EditJobPage from "./pages/recruiter/editJob";

import LoginAdmin from "./pages/login/loginAsAdmin";
import AdminLayout from "./pages/admin/layout";
import DashboardAdmin from "./pages/admin/dashboard";
import JobManagementAdmin from "./pages/admin/jobManagement";
import CompaniesManagement from "./pages/admin/companyManagement";
import UsersManagement from "./pages/admin/userManagement";
import JobDetailAdmin from "./pages/admin/jobDetail";

import Companies from "./pages/company";
import CompanyDetail from "./pages/company-detail";
import Job from "./pages/job";
import JobApplied from "./pages/job-applied";
import FavoriteJobs from "./pages/favorite-jobs";
import JobDetail from "./pages/job-detail";
import Profile from "./pages/profile";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<Job />} />
        <Route path="/companies" element={<Companies />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route
          path="/company-detail/:companyId"
          element={<CompanyDetail />}
        ></Route>
        <Route path="/job-applied" element={<JobApplied />}></Route>
        <Route path="/jobs/:jobId" element={<JobDetail />}></Route>
        <Route path="/favorite-jobs" element={<FavoriteJobs />} />
        <Route path="/recruiter/login" element={<LoginRecruiter />} />
        <Route path="/recruiter/signup" element={<SignupRecruiter />} />
        <Route path="/recruiter" element={<RecruiterLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<JobManagement />} />
          <Route path="profile" element={<ProfileManagement />} />
          <Route path="create-job" element={<CreateJob />} />
          <Route path="jobs/edit-job/:job_id" element={<EditJobPage />} />
          <Route path="jobs/:jobId/candidates" element={<JobCandidates />} />
          <Route path="update-info" element={<AccountManagement />} />
        </Route>

        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="jobs" element={<JobManagementAdmin />} />
          <Route path="jobs/:jobId" element={<JobDetailAdmin />} />
          <Route path="companies" element={<CompaniesManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="jobs/:jobId" element={<JobCandidates />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
