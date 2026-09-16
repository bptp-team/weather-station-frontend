import type { WeatherSnapshot } from "./weatherSnapshot";

export type ConnectionState = "connecting" | "connected" | "disconnected";

const connectionStateLabels: Record<ConnectionState, string> = {
  connecting: "conectando",
  connected: "conectado",
  disconnected: "desconectado",
};

const numericFields = [
  "air_temperature",
  "air_pressure",
  "air_humidity",
  "air_quality",
  "daylight",
  "precipitation_interval",
] as const;

type NumericField = (typeof numericFields)[number];

export type FormattedWeatherSnapshot = Omit<WeatherSnapshot, NumericField> &
  Record<NumericField, string>;

export function formatConnectionState(state: ConnectionState): string {
  return connectionStateLabels[state];
}

export function formatDateTime(value: string | number, options: Intl.DateTimeFormatOptions): string {
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
  };
}