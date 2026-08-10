import { Request, Response, NextFunction } from "express";
import { checkDatabaseConnection } from "@/shared/database/prisma";

export async function checkHealth(_req: Request, res: Response, next: NextFunction) {
  try {
    const isDatabaseConnected = await checkDatabaseConnection();

    res.status(200).json({
      success: true,
      status: "ok",
      timestamp: new Date().toISOString(),
      database: isDatabaseConnected ? "connected" : "disconnected",
    });
  } catch (error) {
    next(error); // hands off to the centralized error handler
  }
}