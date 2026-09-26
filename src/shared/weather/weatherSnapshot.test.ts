import { describe, expect, it } from "vitest";
import { parseWeatherSnapshot } from "./weatherSnapshot";

const validSnapshot = {
  device_id: "station-01",
  air_temperature: 23.45,
  air_pressure: 101325,
  air_humidity: 45,
  air_quality: 4,
  daylight: 2748,
  precipitation_interval: 0.5,
  received_at: "2026-09-06T00:00:00+00:00",
};

describe("parseWeatherSnapshot", () => {
  it("accepts a complete backend snapshot", () => {
    expect(parseWeatherSnapshot(JSON.stringify(validSnapshot))).toEqual(validSnapshot);
  });

  it("rejects malformed event data", () => {
    expect(() => parseWeatherSnapshot("not-json")).toThrow();
  });

  it("rejects snapshots with missing or non-finite measurements", () => {
    const incompleteSnapshot = { ...validSnapshot, daylight: undefined };
    const nonFiniteSnapshot = { ...validSnapshot, air_temperature: "23.45" };

    expect(() => parseWeatherSnapshot(JSON.stringify(incompleteSnapshot))).toThrow(
      "Invalid weather snapshot",
    );
    expect(() => parseWeatherSnapshot(JSON.stringify(nonFiniteSnapshot))).toThrow(
      "Invalid weather snapshot",
    );
  });
});
