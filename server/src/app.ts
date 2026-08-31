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
import usersRoutes from "@/modules/users/users.routes";
import venuesRoutes from "@/modules/venues/venues.routes"; // <-- NEW

export function createApp(): Application {
  const app = express();

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

  if (isDevelopment) {
    app.use(morgan("dev"));
  }

  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/venues", venuesRoutes); // <-- NEW
  // Future modules register here, e.g.:
  // app.use("/api/search", searchRoutes);     <- Day 7

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}