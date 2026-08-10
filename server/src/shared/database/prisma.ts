import { PrismaClient } from "@prisma/client";
import { isDevelopment } from "@/config/env";
import { logger } from "@/shared/utils/logger";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDevelopment ? ["warn", "error"] : ["error"],
  });

if (isDevelopment) {
  globalForPrisma.prisma = prisma;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error("Database connection check failed", error);
    return false;
  }
}