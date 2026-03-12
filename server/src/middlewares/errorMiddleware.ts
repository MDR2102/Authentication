import { Request, Response, NextFunction } from "express";

import { logger } from "../utils/logger";
import { AUTH_MESSAGES } from "../utils/constants";

interface AppError {
  statusCode?: number;
  message?: string;
  code?: string;
}

export const errorMiddleware = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || AUTH_MESSAGES.INTERNAL_ERROR;

  logger.error(`Error: ${message}`, {
    statusCode,
    code: err.code,
  });

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? AUTH_MESSAGES.INTERNAL_ERROR : message,
    code: err.code,
  });
};
