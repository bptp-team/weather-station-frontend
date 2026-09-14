import { describe, expect, it } from "vitest";
import { mapHistoryPoints } from "./historyMappers";

describe("mapHistoryPoints", () => {
  it("sorts readings chronologically and preserves numeric values", () => {
    const later = { device_id: "station-01", air_temperature: 23.45, air_pressure: 1, air_humidity: 45, air_quality: 4, daylight: 2748, water_level: 12, received_at: "2026-09-13T12:00:00Z" };
    const earlier = { ...later, air_temperature: 22.1, received_at: "2026-09-13T11:00:00Z" };

    expect(mapHistoryPoints([later, earlier])).toMatchObject([
      { received_at: earlier.received_at, air_temperature: 22.1 },
      { received_at: later.received_at, air_temperature: 23.45 },
    ]);
  });
});
