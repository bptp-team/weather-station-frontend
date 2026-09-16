export type HistoricalReading = {
  device_id: string;
  air_temperature: number;
  air_pressure: number;
  air_humidity: number;
  air_quality: number;
  daylight: number;
  precipitation_interval: number;
  received_at: string;
};

export type HistoryRange = "24h" | "7d" | "15d";

export type HistoryPoint = HistoricalReading & {
  timestamp: number;
};
