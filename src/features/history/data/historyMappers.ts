import { parseWeatherSnapshot } from "../../../weatherSnapshot";
import { interpretDaylight } from "../../daylight/daylightInterpreter";
import type { HistoricalReading, HistoryPoint } from "../types";

export function mapHistoryPoints(readings: HistoricalReading[]): HistoryPoint[] {
  return readings.reduce<HistoryPoint[]>((points, reading) => {
    const point = mapHistoryPoint(reading);
    if (!point) {
      return points;
    }

    points.push(point);
    return points;
  }, []);
}

function mapHistoryPoint(reading: HistoricalReading): HistoryPoint | null {
  const timestamp = new Date(reading.received_at).getTime();
  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return {
    ...reading,
    timestamp,
    daylight_state: interpretDaylight(reading.daylight).state,
  };
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
    return mapHistoryPoint(snapshot);
  } catch {
    return null;
  }
}
