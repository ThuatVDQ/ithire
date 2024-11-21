import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8090/api/jobs";

const jobApi = {
  // Tạo công việc
  createJob: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, data);
      toast.success("Job created successfully!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create job.";
      toast.error(errorMessage);
      throw error;
    }
  },

  // Lấy chi tiết công việc
  getJobDetail: async (jobId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${jobId}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch job details.";
      toast.error(errorMessage);
      throw error;
    }
  },

  // Lấy công việc theo công ty
  getJobsByCompany: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch jobs by company.";
      toast.error(errorMessage);
      throw error;
    }
  },

  // Lấy công việc theo trạng thái
  getJobsByStatus: async (status, params = {}) => {
    try {
      const response = await axios.get(`${BASE_URL}/${status}`, { params });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch jobs by status.";
      toast.error(errorMessage);
      throw error;
    }
  },

  // Lấy tất cả công việc
  getAllJobs: async (params = {}) => {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");

      // Cấu hình headers
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${BASE_URL}`, {
        params,
        headers,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch all jobs.";
      toast.error(errorMessage);
      throw error;
    }
  },

  // Ứng tuyển công việc
  applyJob: async (jobId, formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/apply/${jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.data?.message === "Invalid token.") {
        toast.error("Please login to apply for jobs.");
      }
      else 
        toast.error("Failed to apply for the job.");
      console.log(error);
      throw error;
    }
  },

  // Duyệt công việc
  approveJob: async (jobId) => {
    try {
      const response = await axios.post(`${BASE_URL}/${jobId}/approve`);
      toast.success("Job approved successfully!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to approve job.";
      toast.error(errorMessage);
      throw error;
    }
  },

  // Từ chối công việc
  rejectJob: async (jobId) => {
    try {
      const response = await axios.post(`${BASE_URL}/${jobId}/reject`);
      toast.success("Job rejected successfully!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to reject job.";
      toast.error(errorMessage);
      throw error;
    }
  },

  // Lấy công việc yêu thích
  getFavoriteJobs: async (params = {}) => {
    try {
      if (!localStorage.getItem("token")) {
        return { favoriteJobs: [] };
      }
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");

      // Cấu hình headers
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${BASE_URL}/user/my-favorites`, {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch favorite jobs.";
      console.log(errorMessage);
      throw error;
    }
  },
  searchJobs: async (params = {}, token = null) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${BASE_URL}/search`, {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to search jobs.";
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default jobApi;
