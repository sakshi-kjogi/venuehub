import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env, isDevelopment } from "@/config/env";
import { errorHandler } from "@/shared/middleware/errorHandler";
import { notFoundHandler } from "@/shared/middleware/notFoundHandler";
import healthRoutes from "@/modules.health/health.routes";
import authRoutes from "@/modules/auth/auth.routes";
import usersRoutes from "@/modules/users/users.routes"; // <-- NEW

export function createApp(): Application {
  const app = express();

  // ---- Security & parsing middleware ----
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // ---- Logging ----
  if (isDevelopment) {
    app.use(morgan("dev"));
  }

  // ---- Routes ----
  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes); // <-- NEW
  // Future modules register here, e.g.:
  // app.use("/api/venues", venueRoutes);      <- Day 6

  // ---- 404 + error handling (must be LAST) ----
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}