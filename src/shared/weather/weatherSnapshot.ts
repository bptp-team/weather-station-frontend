export type WeatherSnapshot = {
  device_id: string;
  air_temperature: number;
  air_pressure: number;
  air_humidity: number;
  air_quality: number;
  daylight: number;
  precipitation_interval: number;
  received_at: string;
};

const numericFields = [
  "air_temperature",
  "air_pressure",
  "air_humidity",
  "air_quality",
  "daylight",
  "precipitation_interval",
] as const;

export function parseWeatherSnapshot(eventData: string): WeatherSnapshot {
  const payload: unknown = JSON.parse(eventData);

  if (
    !isRecord(payload) ||
    typeof payload.device_id !== "string" ||
    typeof payload.received_at !== "string"
  ) {
    throw new Error("Invalid weather snapshot");
  }

  for (const field of numericFields) {
    if (typeof payload[field] !== "number" || !Number.isFinite(payload[field])) {
      throw new Error("Invalid weather snapshot");
    }
  }

  return payload as unknown as WeatherSnapshot;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
