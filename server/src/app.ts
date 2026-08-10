import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env, isDevelopment } from "@/config/env";
import { errorHandler } from "@/shared/middleware/errorHandler";
import { notFoundHandler } from "@/shared/middleware/notFoundHandler";
import healthRoutes from "@/modules.health/health.routes";

export function createApp(): Application {
  const app = express();

  // ---- Security & parsing middleware ----
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true, // required later for refresh-token cookies (Day 4)
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ---- Logging ----
  if (isDevelopment) {
    app.use(morgan("dev"));
  }

  // ---- Routes ----
  app.use("/api/health", healthRoutes);

  // Future modules register here, e.g.:
  // app.use("/api/auth", authRoutes);        <- Day 4
  // app.use("/api/venues", venueRoutes);      <- Day 6

  // ---- 404 + error handling (must be LAST) ----
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}