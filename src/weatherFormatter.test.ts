import { describe, expect, it } from "vitest";
import { formatConnectionState, formatDateTime, formatWeatherSnapshot } from "./weatherFormatter";

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
    const expectedReceivedAt = new Date(snapshot.received_at).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
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

    expect(formatWeatherSnapshot(snapshot).received_at).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});

describe("formatDateTime", () => {
  it("formats a valid timestamp with the requested date and time parts", () => {
    const timestamp = "2026-09-13T12:34:56.000Z";

    expect(formatDateTime(timestamp, {
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      month: "2-digit",
    })).toBe(new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
      minute: "2-digit",
      month: "2-digit",
    }).format(new Date(timestamp)));
  });

  it("returns the original value when the timestamp is invalid", () => {
    expect(formatDateTime("not-a-date", { hour: "2-digit" })).toBe("not-a-date");
  });
});