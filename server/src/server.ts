import { createApp } from "@/app";
import { env } from "@/config/env";
import { prisma, checkDatabaseConnection } from "@/shared/database/prisma";
import { logger } from "@/shared/utils/logger";

async function startServer() {
  const isDatabaseConnected = await checkDatabaseConnection();

  if (!isDatabaseConnected) {
    logger.error("Failed to connect to the database. Server will not start.");
    process.exit(1); // fail fast — a server that can't reach its database
                      // shouldn't pretend to be healthy
  }

  const app = createApp();

  const server = app.listen(env.port, () => {
    logger.info(`VenueHub API running on port ${env.port} [${env.nodeEnv}]`);
    logger.info(`Health check: http://localhost:${env.port}/api/health`);
  });

  // ---- Graceful shutdown ----
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info("Server and database connections closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer();