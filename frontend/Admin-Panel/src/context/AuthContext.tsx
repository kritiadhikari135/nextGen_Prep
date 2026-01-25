import { createContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/api/auth";

interface User {
  id: number;
  username?: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser?: (user: User) => void;
}

// Create Auth Context
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("authToken");

      console.log("AuthContext init - Token found:", !!storedToken);

      if (storedToken) {
        try {
          // Set token state first
          setToken(storedToken);

          // Always verify with backend on reload to ensure token is still valid
          const response = await authApi.getCurrentUser();

          if (response.success && response.data?.user) {
            setUser(response.data.user);
            console.log("Session verified and restored for:", response.data.user.email);
          } else {
            console.log("Session token invalid or expired");
            logout(); // Clean up if validation fails
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          // Try to recover from localStorage as fallback if server is down
          const storedUser = localStorage.getItem("authUser");
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
              console.log("Restored from cache (Offline mode)");
            } catch (e) {
              logout();
            }
          } else {
            logout();
          }
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);


  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(email, password);

      if (response.success && response.data) {
        const { access_token, user: userData } = response.data;

        localStorage.setItem("authToken", access_token);
        localStorage.setItem("authUser", JSON.stringify(userData));

        // Update state with new token and user
        setToken(access_token);
        setUser(userData);

        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(name, email, password);

      if (response.success && response.data) {
        const { access_token, user: userData } = response.data;

        localStorage.setItem("authToken", access_token);
        localStorage.setItem("authUser", JSON.stringify(userData));

        setToken(access_token);
        setUser(userData);

        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
      setToken(null);
      setUser(null);
    }
  };


  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
