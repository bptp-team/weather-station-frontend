export type WeatherSnapshot = {
  device_id: string;
  air_temperature: number;
  air_pressure: number;
  air_humidity: number;
  air_quality: number;
  daylight: number;
  latitude: number | null;
  longitude: number | null;
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

  const hasLegacyCoordinates = payload.latitude === undefined && payload.longitude === undefined;
  const latitude = hasLegacyCoordinates ? null : payload.latitude;
  const longitude = hasLegacyCoordinates ? null : payload.longitude;

  if (
    !isCoordinatePair(latitude, longitude) ||
    !isValidCoordinate(latitude, -90, 90) ||
    !isValidCoordinate(longitude, -180, 180)
  ) {
    throw new Error("Invalid weather snapshot");
  }

  return { ...payload, latitude, longitude } as unknown as WeatherSnapshot;
}

function isCoordinatePair(latitude: unknown, longitude: unknown): boolean {
  return (
    (latitude === null && longitude === null) ||
    (typeof latitude === "number" && typeof longitude === "number")
  );
}

function isValidCoordinate(coordinate: unknown, minimum: number, maximum: number): boolean {
  return (
    coordinate === null ||
    (typeof coordinate === "number" &&
      Number.isFinite(coordinate) &&
      coordinate >= minimum &&
      coordinate <= maximum)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
