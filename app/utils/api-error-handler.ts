/**
 * API Error Handler Utility
 * Centralized error handling for API requests with user-friendly messages
 */

export interface ApiError {
  message: string;
  statusCode?: number;
  originalError?: any;
}

/**
 * Parse API error response and return user-friendly message
 */
export const handleApiError = async (error: any): Promise<ApiError> => {
  // Network errors (no internet, timeout, etc.)
  if (error.message === 'Network request failed' || error.name === 'TypeError') {
    return {
      message: 'No internet connection. Please check your network and try again.',
      statusCode: 0,
      originalError: error,
    };
  }

  // Timeout errors
  if (error.message?.includes('timeout') || error.code === 'ECONNABORTED') {
    return {
      message: 'Request timed out. Please try again.',
      statusCode: 0,
      originalError: error,
    };
  }

  // If error is a Response object
  if (error instanceof Response) {
    return await parseResponseError(error);
  }

  // If error has a response property (fetch error)
  if (error.response) {
    return await parseResponseError(error.response);
  }

  // Generic error
  return {
    message: 'An unexpected error occurred. Please try again.',
    statusCode: 0,
    originalError: error,
  };
};

/**
 * Parse HTTP response error
 */
const parseResponseError = async (response: Response): Promise<ApiError> => {
  const statusCode = response.status;
  let errorMessage = 'An error occurred. Please try again.';

  try {
    const data = await response.json();
    
    // Try different common error message fields
    errorMessage = 
      data.message || 
      data.error || 
      data.detail || 
      data.msg ||
      errorMessage;

    // Handle specific status codes
    switch (statusCode) {
      case 400:
        errorMessage = data.message || 'Invalid request. Please check your input.';
        break;
      case 401:
        errorMessage = data.message || 'Invalid credentials. Please try again.';
        break;
      case 403:
        errorMessage = data.message || 'Your account has been disabled. Please contact support.';
        break;
      case 404:
        errorMessage = data.message || 'User not found. Please check your credentials.';
        break;
      case 409:
        errorMessage = data.message || 'This email is already registered. Please login instead.';
        break;
      case 422:
        errorMessage = data.message || 'Validation error. Please check your input.';
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorMessage = 'Server error. Please try again later.';
        break;
    }
  } catch (parseError) {
    // If response is not JSON, use status-based messages
    console.error('Error parsing response:', parseError);
  }

  return {
    message: errorMessage,
    statusCode,
    originalError: response,
  };
};

/**
 * Make API request with error handling
 */
export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 30000
): Promise<T> => {
  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check if response is ok
    if (!response.ok) {
      const error = await parseResponseError(response);
      throw error;
    }

    // Parse and return response
    const data = await response.json();
    return data as T;
  } catch (error: any) {
    // Handle abort/timeout
    if (error.name === 'AbortError') {
      throw {
        message: 'Request timed out. Please try again.',
        statusCode: 0,
        originalError: error,
      } as ApiError;
    }

    // If it's already an ApiError, throw it
    if (error.message && error.statusCode !== undefined) {
      throw error;
    }

    // Otherwise, parse the error
    const apiError = await handleApiError(error);
    throw apiError;
  }
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  
  // Add more password requirements as needed
  // if (!/[A-Z]/.test(password)) {
  //   return { valid: false, message: 'Password must contain at least one uppercase letter' };
  // }
  
  return { valid: true };
};
