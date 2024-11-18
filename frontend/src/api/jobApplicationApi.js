import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8090/api/job-applications"; // Replace with your actual API base URL

const jobApplicationApi = {
  downloadCV: async (jobId) => {
    try {
      const response = await axios.get(`${BASE_URL}/downloadCV/${jobId}`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cvs_${jobId}.zip`); // Set file name
      document.body.appendChild(link);
      link.click();
      toast.success("CVs downloaded successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to download CVs.";
      toast.error(errorMessage);
      throw error;
    }
  },

  getJobApplicationsByJobId: async (jobId, page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/${jobId}?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data; // Return applications and pagination data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch job applications.";
      toast.error(errorMessage);
      throw error;
    }
  },

  // API to change application status
  changeApplicationStatus: async (applicationId, newStatus) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/change-status/${applicationId}`,
        { newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Application status updated successfully!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update application status.";
      toast.error(errorMessage);
      throw error;
    }
  },

  // API to check if a user has already applied for a specific job
  checkJobApplication: async (jobId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/${jobId}/check-application`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data; // { applied: true/false, applicationId, status }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to check job application status.";
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default jobApplicationApi;
