/**
 * Minimal centralized logger. Deliberately simple today — this is the single
 * seam we'd swap for Winston/Pino later without touching call sites elsewhere
 * in the app, since every file logs through this module, never through
 * raw console.log directly.
 */
export const logger = {
  info: (message: string, meta?: unknown) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta ?? "");
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta ?? "");
  },
  error: (message: string, meta?: unknown) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta ?? "");
  },
};