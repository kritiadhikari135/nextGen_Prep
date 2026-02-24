import axios from "axios";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

// Ensure baseURL has trailing slash for proper endpoint concatenation
const baseURL = BACKEND_BASE_URL?.endsWith('/') ? BACKEND_BASE_URL : `${BACKEND_BASE_URL}/`;

console.log("🔧 API Client initialized with baseURL:", baseURL);

const apiClient = axios.create({
  baseURL,
});

// Add request interceptor to include authorization token and handle content types
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling (optional)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config?.method?.toUpperCase()} ${response.config?.url}`, {
      dataType: typeof response.data,
      contentType: response.headers['content-type'],
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error(`❌ ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      dataType: typeof error.response?.data,
      contentType: error.response?.headers['content-type'],
      data: error.response?.data,
    });
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
