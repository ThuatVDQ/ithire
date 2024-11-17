import axios from "axios";

const API_BASE_URL = "http://localhost:8090/api/auth";

const authApi = {
  // Đăng ký người dùng mới
  signup: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/signup`, data);
    return response.data;
  },

  // Xác thực OTP
  verifyOTP: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/verify-otp`, data);
    return response.data;
  },

  // Gửi lại OTP
  resendOTP: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/resend-otp`, data);
    return response.data;
  },

  // Gửi OTP để reset mật khẩu
  sendResetPasswordOTP: async (data) => {
    const response = await axios.post(
      `${API_BASE_URL}/send-reset-password-otp`,
      data
    );
    return response.data;
  },

  // Đặt lại mật khẩu
  resetPassword: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, data);
    return response.data;
  },

  // Đăng nhập
  login: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/login`, data);
    return response.data;
  },

  // Cập nhật thông tin người dùng
  updateUser: async (data, token) => {
    const response = await axios.put(`${API_BASE_URL}/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Tải avatar
  uploadAvatar: async (formData, token) => {
    const response = await axios.post(
      `${API_BASE_URL}/upload-avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Thêm công việc yêu thích
  addFavoriteJob: async (jobId, token) => {
    const response = await axios.post(
      `${API_BASE_URL}/favorites`,
      { job_id: jobId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Xóa công việc yêu thích
  removeFavoriteJob: async (jobId, token) => {
    const response = await axios.delete(`${API_BASE_URL}/favorites/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Lấy thông tin người dùng
  getUserInfo: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Thay đổi mật khẩu
  changePassword: async (data, token) => {
    const response = await axios.post(`${API_BASE_URL}/change-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Lấy dữ liệu Dashboard cho Admin
  getDashboard: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default authApi;
