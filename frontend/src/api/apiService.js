import axios from "axios";

class ApiService {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  }

  handleError(error) {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.data.message || "Unknown error"
      );
      throw new Error(error.response.data.message || "An error occurred.");
    } else {
      console.error("API Error:", error.message);
      throw new Error("Network error or server is not reachable.");
    }
  }

  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post(endpoint, data = {}) {
    try {
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(endpoint, data = {}) {
    try {
      const response = await this.client.put(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(endpoint, params = {}) {
    try {
      const response = await this.client.delete(endpoint, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default ApiService;
