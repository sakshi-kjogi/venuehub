import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  nodeEnv: string;
  port: number;
  clientUrl: string;
  databaseUrl: string;
  directUrl: string;
  jwtAccessSecret: string;
  jwtAccessExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
  bcryptSaltRounds: number;
  cookieDomain: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
}

/**
 * Reads a required environment variable, or throws a clear startup error
 * if it's missing. Failing fast at boot time beats failing mysteriously
 * mid-request in production.
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${key}. Check your .env file against .env.example.`
    );
  }
  return value;
}

export const env: EnvConfig = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  databaseUrl: requireEnv("DATABASE_URL"),
  directUrl: requireEnv("DIRECT_URL"),
  jwtAccessSecret: requireEnv("JWT_ACCESS_SECRET"),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  jwtRefreshSecret: requireEnv("JWT_REFRESH_SECRET"),
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
  cookieDomain: process.env.COOKIE_DOMAIN ?? "localhost",
  cloudinaryCloudName: requireEnv("CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: requireEnv("CLOUDINARY_API_KEY"),
  cloudinaryApiSecret: requireEnv("CLOUDINARY_API_SECRET"),
};

export const isProduction = env.nodeEnv === "production";
export const isDevelopment = env.nodeEnv === "development";