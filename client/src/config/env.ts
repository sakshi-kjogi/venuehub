interface EnvConfig {
  apiBaseUrl: string;
  appName: string;
}

function requireEnv(key: string, fallback?: string): string {
  const value = import.meta.env[key] ?? fallback;
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Check your client/.env file.`
    );
  }
  return value;
}

export const env: EnvConfig = {
  apiBaseUrl: requireEnv("VITE_API_BASE_URL", "http://localhost:5000/api"),
  appName: "VenueHub",
};