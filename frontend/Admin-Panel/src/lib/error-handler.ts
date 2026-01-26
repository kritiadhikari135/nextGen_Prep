import { AxiosError } from "axios";

/**
 * Extracts error message from various error types
 * Prioritizes backend error messages over generic fallbacks
 */
export function extractErrorMessage(error: unknown, fallbackMessage: string = "An error occurred"): string {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    // Check for backend error response
    if (error.response?.data) {
      const data = error.response.data as any;
      
      // FastAPI typically returns a 'detail' field
      if (typeof data.detail === "string") {
        return data.detail;
      }
      
      // Handle other possible error formats
      if (typeof data.message === "string") {
        return data.message;
      }
      
      if (typeof data.error === "string") {
        return data.error;
      }
    }
    
    // Check for HTTP status messages
    if (error.message) {
      return error.message;
    }
    
    // Check for response status text
    if (error.response?.statusText) {
      return error.response.statusText;
    }
  }
  
  // Handle regular Error objects
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }
  
  // Handle string errors
  if (typeof error === "string") {
    return error;
  }
  
  // Fallback
  return fallbackMessage;
}

/**
 * Maps HTTP status codes to user-friendly messages
 */
export function getHttpErrorMessage(statusCode?: number): string {
  const messages: { [key: number]: string } = {
    400: "Invalid input. Please check your data.",
    401: "Unauthorized. Please log in again.",
    403: "You don't have permission to perform this action.",
    404: "The requested resource was not found.",
    409: "This resource already exists.",
    500: "Server error. Please try again later.",
    502: "Service unavailable. Please try again later.",
    503: "Service temporarily unavailable.",
  };
  
  return messages[statusCode || 500] || "An unexpected error occurred.";
}
