import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8090/api/cvs";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// CV API functions
const cvApi = {
  downloadCV: async (cvId) => {
    try {
      const response = await axios.get(`${BASE_URL}/downloadCV/${cvId}`, {
        headers: getAuthHeaders(),
        responseType: "blob", // To handle file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cv_${cvId}.pdf`); // Set file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      toast.success("CV downloaded successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to download CV.";
      toast.error(errorMessage);
      throw error;
    }
  },

  viewCV: async (filename) => {
    try {
      const response = await axios.get(`${BASE_URL}/viewCV/${filename}`, {
        headers: getAuthHeaders(),
        responseType: "blob", // To handle file viewing
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, "_blank");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to view CV.";
      toast.error(errorMessage);
      throw error;
    }
  },
};

export default cvApi;
