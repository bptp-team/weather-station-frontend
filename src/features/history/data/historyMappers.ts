import type { HistoricalReading, HistoryPoint } from "../types";

export function mapHistoryPoints(readings: HistoricalReading[]): HistoryPoint[] {
  return readings
    .map((reading) => ({ ...reading, timestamp: new Date(reading.received_at).getTime() }))
    .filter((reading) => Number.isFinite(reading.timestamp))
    .sort((left, right) => left.timestamp - right.timestamp);
}
