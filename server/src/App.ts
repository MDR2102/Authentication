import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import envConfig from "./config/envConfig";
import connectDatabase from "./db/connection";
import authRoutes from "./features/auth/routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { logger } from "./utils/logger";
import { RATE_LIMIT_CONFIG, AUTH_RATE_LIMIT_CONFIG } from "./utils/constants";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: envConfig.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(hpp());

// Rate limiting
const generalLimiter = rateLimit(RATE_LIMIT_CONFIG);
const authLimiter = rateLimit(AUTH_RATE_LIMIT_CONFIG);

app.use(generalLimiter);

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authLimiter, authRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Error handling
app.use(errorMiddleware);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(envConfig.PORT, () => {
      logger.info(`Server running on port ${envConfig.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
