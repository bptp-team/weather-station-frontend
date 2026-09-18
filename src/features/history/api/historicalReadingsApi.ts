import type { HistoricalReading } from "../types";

const apiBaseUrl = import.meta.env.VITE_WEATHER_API_URL ?? "http://localhost:8000";

function isHistoricalReading(value: unknown): value is HistoricalReading {
  if (!value || typeof value !== "object") return false;
  const reading = value as Record<string, unknown>;
  const numericFields = [
    "air_temperature",
    "air_pressure",
    "air_humidity",
    "air_quality",
    "daylight",
    "precipitation_interval",
  ];

  return (
    typeof reading.device_id === "string" &&
    typeof reading.received_at === "string" &&
    numericFields.every(
      (field) => typeof reading[field] === "number" && Number.isFinite(reading[field]),
    )
  );
}

export async function fetchHistoricalReadings(
  stationId: string,
  from: Date,
  to: Date,
  signal?: AbortSignal,
): Promise<HistoricalReading[]> {
  const url = new URL(`/api/v1/readings/${encodeURIComponent(stationId)}`, apiBaseUrl);
  url.searchParams.set("from", from.toISOString());
  url.searchParams.set("to", to.toISOString());

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Historical readings request failed: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !payload.every(isHistoricalReading)) {
    throw new Error("Historical readings response is invalid");
  }

  return payload;
}
