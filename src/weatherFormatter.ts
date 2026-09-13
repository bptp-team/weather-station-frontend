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
  "water_level",
] as const;

type NumericField = (typeof numericFields)[number];

export type FormattedWeatherSnapshot = Omit<WeatherSnapshot, NumericField> &
  Record<NumericField, string>;

export function formatConnectionState(state: ConnectionState): string {
  return connectionStateLabels[state];
}

export function formatWeatherSnapshot(snapshot: WeatherSnapshot): FormattedWeatherSnapshot {
  return {
    device_id: snapshot.device_id,
    air_temperature: snapshot.air_temperature.toFixed(2),
    air_pressure: snapshot.air_pressure.toFixed(2),
    air_humidity: snapshot.air_humidity.toFixed(2),
    air_quality: snapshot.air_quality.toFixed(2),
    daylight: snapshot.daylight.toFixed(2),
    water_level: snapshot.water_level.toFixed(2),
    received_at: formatReceivedAt(snapshot.received_at),
  };
}

function formatReceivedAt(receivedAt: string): string {
  const date = new Date(receivedAt);

  if (Number.isNaN(date.getTime())) {
    return receivedAt;
  }

  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
}