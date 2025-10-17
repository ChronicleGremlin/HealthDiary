import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Configure axios defaults
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      console.log("API Response Headers:", error.response.headers);
      console.log("Request URL:", error.config.url);
      console.log("Request Headers:", error.config.headers);

      if (status === 401 || status === 403) {
        // Clear token on auth errors
        console.error(`Authentication error (${status}):`, data);
        localStorage.removeItem("token");
      }
      // Attach backend error message (if any) to error.message to make it easier to handle downstream
         if (data && data.message) {
             error.message = data.message;
         }
    } else if (error.request) {
      console.error("Network error:", error.message);
    }
    return Promise.reject(error);
  }
);


export const recordApi = {
  getAllRecords: () => axiosInstance.get("/api/records/all"),
  getRecordsById: (id) => axiosInstance.get(`/api/records/find/${id}`),
  getRecordsByName: (name) => axiosInstance.get(`/api/records/find/name/${name}`),
  createRecord: (recordData) => axiosInstance.post("/api/records/add", recordData),
  updateRecord: (id, recordData) =>
    axiosInstance.put(`/api/records/update/${id}`, recordData),
  deleteRecord: (id) => axiosInstance.delete(`/api/records/delete/${id}`),
  rebookRecord: (id, rebookData) =>
    axiosInstance.post(`/api/records/rebook/${id}`, rebookData),
};

export const calendarApi = {
  getMyCalendar: () => axiosInstance.get("/api/calendars/my"),
  getCalendarById: (id) => axiosInstance.get(`/api/calendars/${id}`),
  addCalendar: (calendarData) =>
    axiosInstance.post("/api/calendars", calendarData),
  deleteCalendar: (id) => axiosInstance.delete(`/api/calendars/${id}`),
};

export const authApi = {
  login: (credentials) => axiosInstance.post("/api/auth/login", credentials),
  register: (userData) => axiosInstance.post("/api/auth/register", userData),
  getCurrentUser: () => axiosInstance.get("/api/auth/user"),
  logout: () => axiosInstance.post("/api/auth/logout"),
  getOAuthUrl: () => "http://localhost:8080/oauth2/authorization/google",
      resetPassword: (data) =>
          axiosInstance.post("/api/auth/reset-password", data),
};

export const userApi = {
    getUserProfile: () => axiosInstance.get("/api/auth/profile"),
    updateUser: (data) => axiosInstance.put("/api/auth/update-profile", data),
    deleteUser: (userId) =>
        axiosInstance.post("/api/auth/delete", null, {
        params: { userId },
        }),
    fetchUsers: () => axiosInstance.get("/api/auth/all"),
};
