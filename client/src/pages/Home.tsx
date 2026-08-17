import { useEffect, useState } from "react";
import { apiGet } from "@/lib/apiClient";

type BackendStatus = "checking" | "connected" | "disconnected";

export function Home() {
  const [status, setStatus] = useState<BackendStatus>("checking");

  useEffect(() => {
    apiGet<{ database: string }>("/health")
      .then((data) => {
        setStatus(data.database === "connected" ? "connected" : "disconnected");
      })
      .catch(() => setStatus("disconnected"));
  }, []);

  const statusColor =
    status === "connected"
      ? "text-green-600"
      : status === "checking"
        ? "text-gray-400"
        : "text-red-600";

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900">
        VenueHub — Plan. Book. Celebrate.
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Discover venues, hire vendors, and manage your entire event in one place.
      </p>
      <p className={`mt-8 text-sm font-medium ${statusColor}`}>
        Backend: {status}
      </p>
    </div>
  );
}