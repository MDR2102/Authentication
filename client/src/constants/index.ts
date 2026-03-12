export const API_BASE_URL = "/api";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
};

export const APP_NAME = "MERN Auth";

export const VALIDATION_MESSAGES = {
  FIRST_NAME_REQUIRED: "First name is required",
  LAST_NAME_REQUIRED: "Last name is required",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please enter a valid email",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN: "Password must be at least 8 characters",
  PASSWORD_PATTERN:
    "Must contain uppercase, lowercase, number, and special character",
};
