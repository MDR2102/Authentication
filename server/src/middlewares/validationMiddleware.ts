import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AUTH_MESSAGES } from "../utils/constants";

type ValidationSource = "body" | "params" | "query";

export const validate = (
  schema: Joi.ObjectSchema,
  source: ValidationSource = "body",
  allowCookieFallback: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    let dataToValidate = req[source];

    if (
      allowCookieFallback &&
      source === "body" &&
      (!dataToValidate || Object.keys(dataToValidate).length === 0)
    ) {
      dataToValidate = { refreshToken: req.cookies?.refreshToken };
    }

    const { error, value } = schema.validate(dataToValidate);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);

      res.status(400).json({
        success: false,
        message: AUTH_MESSAGES.VALIDATION_ERROR,
        data: errorMessages,
      });
      return;
    }

    req[source] = value;
    next();
  };
};
