import { parseWeatherSnapshot } from "../../../weatherSnapshot";
import type { HistoricalReading, HistoryPoint } from "../types";

export function mapHistoryPoints(readings: HistoricalReading[]): HistoryPoint[] {
  return readings
    .map((reading) => ({ ...reading, timestamp: new Date(reading.received_at).getTime() }))
    .filter((reading) => Number.isFinite(reading.timestamp))
    .sort((left, right) => left.timestamp - right.timestamp);
}

export function mergeLivePoint(
  data: HistoryPoint[],
  point: HistoryPoint,
  rangeMs: number,
  now: number,
): HistoryPoint[] {
  const windowStart = now - rangeMs;
  const trimmed = data.filter((entry) => entry.timestamp >= windowStart);

  if (trimmed.length === 0) {
    return [point];
  }

  const lastPoint = trimmed[trimmed.length - 1];
  if (point.timestamp > lastPoint.timestamp) {
    return [...trimmed, point];
  }

  return [...trimmed, point];
}

export function parseLiveHistoryMessage(eventData: string, stationId: string): HistoryPoint | null {
  try {
    const snapshot = parseWeatherSnapshot(eventData);
    if (snapshot.device_id !== stationId) {
      return null;
    }
    return mapHistoryPoints([snapshot])[0] ?? null;
  } catch {
    return null;
  }
}
