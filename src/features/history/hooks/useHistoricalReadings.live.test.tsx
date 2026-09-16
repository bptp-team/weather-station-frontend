// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useHistoricalReadings } from "./useHistoricalReadings";

const baseReading = {
  device_id: "station-01",
  air_temperature: 20,
  air_pressure: 1,
  air_humidity: 50,
  air_quality: 10,
  daylight: 100,
  precipitation_interval: 0,
};

class FakeEventSource {
  static instances: FakeEventSource[] = [];
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onopen: (() => void) | null = null;
  closed = false;

  constructor(public url: string) {
    FakeEventSource.instances.push(this);
  }

  emit(data: unknown) {
    this.onmessage?.({ data: JSON.stringify(data) });
  }

  close() {
    this.closed = true;
  }
}

afterEach(() => {
  vi.restoreAllMocks();
  FakeEventSource.instances = [];
});

describe("useHistoricalReadings live updates", () => {
  it("appends a new point streamed via SSE to the returned data, proving the chart data actually changes", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify([{ ...baseReading, received_at: "2026-09-16T12:00:00.000Z" }]),
        { status: 200 },
      ),
    );
    vi.stubGlobal("EventSource", FakeEventSource);

    const { result } = renderHook(() => useHistoricalReadings("station-01", "24h"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data.map((point) => point.received_at)).toEqual(["2026-09-16T12:00:00.000Z"]);

    const stream = FakeEventSource.instances[0];
    expect(stream).toBeDefined();

    act(() => {
      stream.emit({ ...baseReading, received_at: "2026-09-16T12:05:00.000Z" });
    });

    await waitFor(() =>
      expect(result.current.data.map((point) => point.received_at)).toEqual([
        "2026-09-16T12:00:00.000Z",
        "2026-09-16T12:05:00.000Z",
      ]),
    );
  });

  it("ignores a live message for a different station", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    vi.stubGlobal("EventSource", FakeEventSource);

    const { result } = renderHook(() => useHistoricalReadings("station-01", "24h"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const stream = FakeEventSource.instances[0];
    act(() => {
      stream.emit({ ...baseReading, device_id: "station-02", received_at: "2026-09-16T12:05:00.000Z" });
    });

    expect(result.current.data).toEqual([]);
  });
});
