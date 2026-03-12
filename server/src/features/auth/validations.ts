import Joi from "joi";

export const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name must not exceed 50 characters",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name must not exceed 50 characters",
    "any.required": "Last name is required",
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 128 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number, and special character",
      "any.required": "Password is required",
    }),
}).options({ abortEarly: false, stripUnknown: true });

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
}).options({ abortEarly: false, stripUnknown: true });

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token is required",
  }),
}).options({ abortEarly: false, stripUnknown: true });
