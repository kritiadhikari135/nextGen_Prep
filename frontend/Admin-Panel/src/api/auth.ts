import apiClient from "./index";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface RefreshRequest {
  refresh_token: string;
}

const STORAGE_TOKEN_KEY = "authToken";
const STORAGE_USER_KEY = "authUser";
const STORAGE_REFRESH_TOKEN_KEY = "refreshToken";

export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ access_token: string; user: any }>> => {
    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const { access_token, refresh_token, user } = response.data;

      // Save tokens and user to localStorage
      localStorage.setItem(STORAGE_TOKEN_KEY, access_token);
      localStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, refresh_token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));

      return {
        success: true,
        data: { access_token, user },
      };
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Login failed";
      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  register: async (name: string, email: string, password: string): Promise<ApiResponse<{ access_token: string; user: any }>> => {
    try {
      const response = await apiClient.post<LoginResponse>("/auth/signup", {
        name,
        email,
        password,
        role: "admin", // Default to admin for admin panel
      });

      const { access_token, refresh_token, user } = response.data;

      // Save tokens and user to localStorage
      localStorage.setItem(STORAGE_TOKEN_KEY, access_token);
      localStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, refresh_token);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));

      return {
        success: true,
        data: { access_token, user },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || "Registration failed",
      };
    }
  },

  refreshToken: async (refresh_token: string): Promise<ApiResponse<{ access_token: string }>> => {
    try {
      const response = await apiClient.post<{ access_token: string }>("/auth/refresh", {
        refresh_token,
      });

      const { access_token } = response.data;
      localStorage.setItem(STORAGE_TOKEN_KEY, access_token);

      return {
        success: true,
        data: { access_token },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || "Token refresh failed",
      };
    }
  },

  updatePassword: async (newPassword: string, oldPassword: string): Promise<ApiResponse> => {
    try {
      await apiClient.post("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      return { success: true, message: "Password updated successfully" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || "Failed to update password",
      };
    }
  },

  logout: async (): Promise<ApiResponse> => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_REFRESH_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    return { success: true };
  },

  getCurrentUser: async (): Promise<ApiResponse<{ user: any }>> => {
    try {
      const token = localStorage.getItem(STORAGE_TOKEN_KEY);
      if (!token) {
        return { success: false, message: "No user logged in" };
      }

      const response = await apiClient.get("/auth/me");

      // Update local storage with fresh data from server
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(response.data));

      return { success: true, data: { user: response.data } };
    } catch (error: any) {
      console.error("GetCurrentUser error:", error);
      return { success: false, message: error.response?.data?.detail || "Failed to get user" };
    }
  },

  updateprofile: async (newEmail: string, newName: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.patch("/auth/profile", {
        email: newEmail,
        name: newName,
      });
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(response.data));
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.detail || "Profile update failed",
      };
    }
  },
};
