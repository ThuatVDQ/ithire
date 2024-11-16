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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/recruiter/login" element={<LoginRecruiter />} />
        <Route path="/recruiter/signup" element={<SignupRecruiter />} />
      </Routes>
    </>
  );
}

export default App;
