import { describe, expect, it } from "vitest";
import { formatConnectionState, formatWeatherSnapshot } from "./weatherFormatter";

describe("formatConnectionState", () => {
  it.each([
    ["connecting", "conectando"],
    ["connected", "conectado"],
    ["disconnected", "desconectado"],
  ] as const)("maps %s to %s", (state, expectedLabel) => {
    expect(formatConnectionState(state)).toBe(expectedLabel);
  });
});

describe("formatWeatherSnapshot", () => {
  it("formats every measurement to two decimal places", () => {
    const snapshot = {
      device_id: "station-01",
      air_temperature: 23.456,
      air_pressure: 101325,
      air_humidity: 45,
      air_quality: 4.1,
      daylight: 2748.9,
      water_level: 12.005,
      received_at: "2026-09-06T00:00:00+00:00",
    };
    const expectedReceivedAt = new Date(snapshot.received_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    expect(formatWeatherSnapshot(snapshot)).toEqual({
      ...snapshot,
      air_temperature: "23.46",
      air_pressure: "101325.00",
      air_humidity: "45.00",
      air_quality: "4.10",
      daylight: "2748.90",
      water_level: "12.01",
      received_at: expectedReceivedAt,
    });
  });
});