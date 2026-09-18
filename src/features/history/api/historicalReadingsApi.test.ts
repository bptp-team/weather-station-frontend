import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchHistoricalReadings } from "./historicalReadingsApi";

const reading = {
  device_id: "station-01",
  air_temperature: 23.45,
  air_pressure: 1,
  air_humidity: 45,
  air_quality: 4,
  daylight: 2748,
  precipitation_interval: 0.5,
  received_at: "2026-09-13T12:00:00.000Z",
};

afterEach(() => vi.restoreAllMocks());

describe("fetchHistoricalReadings", () => {
  it("requests the selected station and date range", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify([reading]), { status: 200 }));
    const from = new Date("2026-09-12T12:00:00.000Z");
    const to = new Date("2026-09-13T12:00:00.000Z");

    await expect(fetchHistoricalReadings("station-01", from, to)).resolves.toEqual([reading]);
    expect(fetchMock.mock.calls[0][0].toString()).toContain("/api/v1/readings/station-01?");
    expect(fetchMock.mock.calls[0][0].toString()).toContain(
      `from=${encodeURIComponent(from.toISOString())}`,
    );
  });

  it("rejects HTTP errors and invalid payloads", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 422 }));
    await expect(fetchHistoricalReadings("station-01", new Date(), new Date())).rejects.toThrow(
      "422",
    );

    vi.restoreAllMocks();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([{ nope: true }]), { status: 200 }),
    );
    await expect(fetchHistoricalReadings("station-01", new Date(), new Date())).rejects.toThrow(
      "invalid",
    );
  });
});
