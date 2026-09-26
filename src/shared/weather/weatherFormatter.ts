import type { WeatherSnapshot } from "./weatherSnapshot";

export type ConnectionState = "connecting" | "connected" | "disconnected";

const connectionStateLabels: Record<ConnectionState, string> = {
  connecting: "conectando",
  connected: "conectado",
  disconnected: "desconectado",
};

type NumericField =
  | "air_temperature"
  | "air_pressure"
  | "air_humidity"
  | "air_quality"
  | "daylight"
  | "precipitation_interval";

export type FormattedWeatherSnapshot = Omit<WeatherSnapshot, NumericField | "received_at"> & {
  received_at: string;
  received_at_raw: string;
} & Record<NumericField, string>;

const READING_INTERVAL_IN_MS = 60 * 1000;

export function formatConnectionState(state: ConnectionState): string {
  return connectionStateLabels[state];
}

export function formatCountdown(value: string | number, now = Date.now()): string {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return "00:00";
  }

  const elapsedMs = Math.max(0, now - timestamp);
  const remainingMs = Math.max(0, READING_INTERVAL_IN_MS - elapsedMs);
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatDateTime(
  value: string | number,
  options: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("pt-BR", {
    ...options,
    hourCycle: "h23",
  }).format(date);
}

export function formatWeatherSnapshot(snapshot: WeatherSnapshot): FormattedWeatherSnapshot {
  return {
    device_id: snapshot.device_id,
    air_temperature: snapshot.air_temperature.toFixed(2),
    air_pressure: snapshot.air_pressure.toFixed(2),
    air_humidity: snapshot.air_humidity.toFixed(2),
    air_quality: snapshot.air_quality.toFixed(2),
    daylight: snapshot.daylight.toFixed(2),
    precipitation_interval: snapshot.precipitation_interval.toFixed(2),
    received_at: formatDateTime(snapshot.received_at, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    received_at_raw: snapshot.received_at,
  };
}
