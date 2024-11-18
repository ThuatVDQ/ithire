import React from "react";
import axios from "axios";
import FormCreateJob from "../../components/formJob";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";
export default function CreateJobPage() {
    const navigate = useNavigate();
  const handleCreateJob = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:8090/api/jobs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
      navigate("/recruiter/jobs")
    } catch (error) {
      console.error("Error creating job:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create job.";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <h3 className="text-center py-4 text-white font-bold bg-primary ">Create a New Job</h3>
      <FormCreateJob onSubmit={handleCreateJob} />
    </div>
  );
}
