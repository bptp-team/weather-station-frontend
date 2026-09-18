import { describe, expect, it } from "vitest";
import type { HistoryPoint } from "../types";
import { mapHistoryPoints, mergeLivePoint, parseLiveHistoryMessage } from "./historyMappers";

describe("mapHistoryPoints", () => {
  it("sorts readings chronologically and preserves numeric values", () => {
    const later = {
      device_id: "station-01",
      air_temperature: 23.45,
      air_pressure: 1,
      air_humidity: 45,
      air_quality: 4,
      daylight: 2748,
      precipitation_interval: 0.5,
      received_at: "2026-09-13T12:00:00Z",
    };
    const earlier = { ...later, air_temperature: 22.1, received_at: "2026-09-13T11:00:00Z" };

    expect(mapHistoryPoints([later, earlier])).toMatchObject([
      { received_at: earlier.received_at, air_temperature: 22.1 },
      { received_at: later.received_at, air_temperature: 23.45 },
    ]);
  });
});

const baseReading = {
  device_id: "station-01",
  air_temperature: 20,
  air_pressure: 1,
  air_humidity: 50,
  air_quality: 10,
  daylight: 100,
  precipitation_interval: 0,
};

function point(timestamp: number): HistoryPoint {
  return { ...baseReading, received_at: new Date(timestamp).toISOString(), timestamp };
}

describe("mergeLivePoint", () => {
  it("appends a new point newer than all existing ones, keeping ascending order", () => {
    const data = [point(1000), point(2000)];
    const result = mergeLivePoint(data, point(3000), 10_000, 3000);
    expect(result.map((entry) => entry.timestamp)).toEqual([1000, 2000, 3000]);
  });

  it("takes the fast append path when the new point is newest and nothing is stale", () => {
    const data = [point(1000), point(2000)];
    const result = mergeLivePoint(data, point(3000), 10_000, 3000);
    expect(result).not.toBe(data);
    expect(result.slice(0, 2)).toEqual(data);
    expect(result[2]).toEqual(point(3000));
  });

  it("prunes points older than the sliding window after merging", () => {
    const data = [point(1000), point(5000)];
    const result = mergeLivePoint(data, point(20_000), 10_000, 20_000);
    expect(result.map((entry) => entry.timestamp)).toEqual([20_000]);
  });

  it("prunes and appends together, keeping the window bounded", () => {
    const data = [point(1000), point(15_000)];
    const result = mergeLivePoint(data, point(20_000), 10_000, 20_000);
    expect(result.map((entry) => entry.timestamp)).toEqual([15_000, 20_000]);
  });

  it("returns just the new point when data is empty", () => {
    const result = mergeLivePoint([], point(1000), 10_000, 1000);
    expect(result.map((entry) => entry.timestamp)).toEqual([1000]);
  });

  it("does not re-sort an out-of-order point; fresh snapshots are appended as the newest data", () => {
    const data = [point(1000), point(3000)];
    const result = mergeLivePoint(data, point(2000), 10_000, 3000);
    expect(result.map((entry) => entry.timestamp)).toEqual([1000, 3000, 2000]);
  });

  it("keeps a point exactly at the window boundary", () => {
    const data = [point(10_000)];
    const result = mergeLivePoint(data, point(20_000), 10_000, 20_000);
    expect(result.map((entry) => entry.timestamp)).toEqual([10_000, 20_000]);
  });

  it("drops every existing point when the window is smaller than their age", () => {
    const data = [point(1000), point(2000)];
    const result = mergeLivePoint(data, point(100_000), 10, 100_000);
    expect(result.map((entry) => entry.timestamp)).toEqual([100_000]);
  });
});

describe("parseLiveHistoryMessage", () => {
  const validPayload = JSON.stringify({ ...baseReading, received_at: "2026-09-16T12:00:00.000Z" });

  it("parses a valid message for the matching station", () => {
    const result = parseLiveHistoryMessage(validPayload, "station-01");
    expect(result).not.toBeNull();
    expect(result?.device_id).toBe("station-01");
    expect(result?.timestamp).toBe(new Date("2026-09-16T12:00:00.000Z").getTime());
  });

  it("returns null when the device_id does not match the current station", () => {
    expect(parseLiveHistoryMessage(validPayload, "station-02")).toBeNull();
  });

  it("returns null for a malformed payload", () => {
    expect(parseLiveHistoryMessage("not json", "station-01")).toBeNull();
  });

  it("returns null when required numeric fields are missing", () => {
    expect(
      parseLiveHistoryMessage(JSON.stringify({ device_id: "station-01" }), "station-01"),
    ).toBeNull();
  });
});
