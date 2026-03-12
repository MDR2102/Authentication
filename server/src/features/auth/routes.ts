import { Router } from "express";

import { validate } from "../../middlewares/validationMiddleware";
import { authMiddleware } from "../../middlewares/authMiddleware";

import * as authController from "./controllers";
import { registerSchema, loginSchema, refreshTokenSchema } from "./validations";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/refresh-token",
  validate(refreshTokenSchema, "body", true),
  authController.refreshToken
);
router.get("/profile", authMiddleware, authController.getProfile);
router.post("/logout", authMiddleware, authController.logout);

export default router;
