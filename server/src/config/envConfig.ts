import fs from "fs";
import path from "path";

interface EnvConfig {
  PORT: number;
  MONGODB_URI: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRY: string;
  JWT_REFRESH_EXPIRY: string;
  CLIENT_URL: string;
  NODE_ENV: string;
}

const environment = process.env.NODE_ENV || "development";
const envFilePath = path.resolve(__dirname, "../../env.json");

let envConfig: EnvConfig;

try {
  const rawData = fs.readFileSync(envFilePath, "utf-8");
  const allConfig = JSON.parse(rawData);
  envConfig = allConfig[environment] as EnvConfig;

  if (!envConfig) {
    throw new Error(`No configuration found for environment: ${environment}`);
  }
} catch (error) {
  if (error instanceof Error) {
    throw new Error(`Failed to load env config: ${error.message}`);
  }
  throw new Error("Failed to load env config");
}

export default envConfig;
