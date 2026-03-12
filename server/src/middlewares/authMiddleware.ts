import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import envConfig from "../config/envConfig";
import { ITokenPayload } from "../features/auth/interfaces";
import { AUTH_MESSAGES } from "../utils/constants";

export interface AuthenticatedRequest extends Request {
  userId: string;
  email: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      envConfig.JWT_ACCESS_SECRET
    ) as ITokenPayload;

    (req as AuthenticatedRequest).userId = decoded.userId;
    (req as AuthenticatedRequest).email = decoded.email;

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: AUTH_MESSAGES.INVALID_TOKEN,
    });
  }
};
