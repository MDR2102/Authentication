import mongoose from "mongoose";

import envConfig from "../config/envConfig";
import { logger } from "../utils/logger";

const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(envConfig.MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  logger.error("MongoDB error:", error);
});

export default connectDatabase;
