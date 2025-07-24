import { toast } from "react-toastify";

let authExpirationHandlers = [];

export const onAuthExpired = (handler) => {
  authExpirationHandlers.push(handler);
  
  // Return cleanup function
  return () => {
    authExpirationHandlers = authExpirationHandlers.filter(h => h !== handler);
  };
};

const handleAuthExpiration = () => {
  // Call all registered handlers
  authExpirationHandlers.forEach(handler => handler());
  
  // Clear local storage
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    
    // Show toast notification
    toast.error("Your session has expired. Please login again.", {
      position: "top-right",
      autoClose: 3000,
    });
    
    // Redirect to login after a short delay
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }
};

export const fetchWithAuth = async (url, options = {}) => {
  try {
    // Make the request with credentials
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    // Check if token is expired
    if (data.isExpired) {
      handleAuthExpiration();
      
      return {
        success: false,
        message: "Session expired",
        isExpired: true,
      };
    }

    // Return the data as is for successful responses
    return data;
  } catch (error) {
    console.error("fetchWithAuth error:", error);
    return {
      success: false,
      message: error.message || "Network error occurred",
    };
  }
};