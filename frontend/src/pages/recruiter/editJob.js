import React, { useEffect, useState } from "react";
import axios from "axios";
import FormCreateJob from "../../components/formJob";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import jobApi from "../../api/jobApi"; 

export default function EditJobPage() {
  const { job_id } = useParams(); // Lấy job_id từ URL
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null); // Dữ liệu công việc ban đầu
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  // Lấy thông tin công việc ban đầu
  useEffect(() => {
    fetchJob();
  }, [job_id]);

  const fetchJob = async () => {
    try {
      const data = await jobApi.getJobDetail(job_id);
      console.log("Job Data:", data);
      setJobData(data); // Gán dữ liệu công việc
      setLoading(false); // Tắt trạng thái tải
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Failed to fetch job details.");
      setLoading(false);
    }
  };

  // Cập nhật công việc
  const handleUpdateJob = async (formData) => {
    console.log("Update Job:", formData);
    try {
      const response = await axios.put(
        `http://localhost:8090/api/jobs/${job_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
      navigate("/recruiter/jobs"); 
    } catch (error) {
      console.error("Error updating job:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update job.";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading job details...</div>;
  }

  return (
    <div>
      <h3 className="text-center text-white font-bold py-4 bg-primary">Edit Job</h3>
      {jobData && <FormCreateJob jobData={jobData} onSubmit={handleUpdateJob} />}
    </div>
  );
}
