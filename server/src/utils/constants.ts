import { CookieOptions } from "express";
import envConfig from "../config/envConfig";

export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "User logged in successfully",
  LOGOUT_SUCCESS: "User logged out successfully",
  TOKEN_REFRESHED: "Token refreshed successfully",
  PROFILE_FETCHED: "Profile fetched successfully",
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  USER_NOT_FOUND: "User not found",
  INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
  UNAUTHORIZED: "Authentication required",
  INVALID_TOKEN: "Invalid or expired token",
  VALIDATION_ERROR: "Validation error",
  INTERNAL_ERROR: "Internal server error",
};

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: envConfig.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
};

export const AUTH_RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
};
