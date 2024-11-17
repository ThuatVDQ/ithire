import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8090/api/companies"; // Đường dẫn cơ bản của API

const companyApi = {
  createCompany: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/`, data);
      toast.success("Company created successfully!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create company.";
      toast.error(errorMessage);
      throw error;
    }
  },

  getCompanyDetail: async (companyId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${companyId}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch company details.";
      toast.error(errorMessage);
      throw error;
    }
  },

  getAllCompanies: async (params = {}) => {
    try {
      const response = await axios.get(`${BASE_URL}/`, { params });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch companies.";
      toast.error(errorMessage);
      throw error;
    }
  },

  uploadLogo: async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/upload-logo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Logo uploaded successfully!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload logo.";
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default companyApi;
