import { toast } from "react-toastify";

/**
 * Standardized error handler for API responses
 * @param {Error|Object} error - The error object
 * @param {string} defaultMessage - Default message to show if no specific error message
 * @param {boolean} showToast - Whether to show a toast notification
 * @returns {Object} Standardized error response
 */
export const handleError = (error, defaultMessage = "Something went wrong", showToast = true) => {
  let message = defaultMessage;
  let isExpired = false;
  let status = 500;

  // Handle different error types
  if (error.response) {
    // Server responded with error
    message = error.response.data?.message || error.response.statusText || defaultMessage;
    status = error.response.status;
    isExpired = error.response.data?.isExpired || false;
  } else if (error.request) {
    // Request made but no response
    message = "Network error. Please check your connection.";
  } else if (error.message) {
    // General error with message
    message = error.message;
  }

  // Handle specific error cases
  if (status === 401 || isExpired) {
    message = "Session expired. Please login again.";
    isExpired = true;
    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  } else if (status === 403) {
    message = "You don't have permission to perform this action.";
  } else if (status === 404) {
    message = "The requested resource was not found.";
  } else if (status === 429) {
    message = "Too many requests. Please try again later.";
  }

  // Show toast if requested
  if (showToast) {
    toast.error(message);
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", error);
  }

  return {
    success: false,
    message,
    isExpired,
    status,
  };
};

/**
 * Standardized success handler
 * @param {string} message - Success message
 * @param {any} data - Optional data to return
 * @param {boolean} showToast - Whether to show a toast notification
 * @returns {Object} Standardized success response
 */
export const handleSuccess = (message, data = null, showToast = true) => {
  if (showToast) {
    toast.success(message);
  }

  return {
    success: true,
    message,
    data,
  };
};

/**
 * API response handler wrapper
 * @param {Function} apiCall - The API call function
 * @param {Object} options - Options for error handling
 * @returns {Promise} API response or error
 */
export const apiWrapper = async (apiCall, options = {}) => {
  const {
    defaultError = "Something went wrong",
    showToast = true,
    onError = null,
    onSuccess = null,
  } = options;

  try {
    const response = await apiCall();
    
    if (response.success === false) {
      throw new Error(response.message || defaultError);
    }

    if (onSuccess) {
      onSuccess(response);
    }

    return response;
  } catch (error) {
    const errorResponse = handleError(error, defaultError, showToast);
    
    if (onError) {
      onError(errorResponse);
    }

    return errorResponse;
  }
};