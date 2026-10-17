// @vitest-environment jsdom
import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LiveDashboard } from "./LiveDashboard";

class FakeEventSource {
  static instances: FakeEventSource[] = [];
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onopen: (() => void) | null = null;

  constructor() {
    FakeEventSource.instances.push(this);
  }

  emit(data: unknown) {
    this.onmessage?.({ data: JSON.stringify(data) });
  }

  close() {}
}

afterEach(() => {
  vi.unstubAllGlobals();
  FakeEventSource.instances = [];
});

describe("LiveDashboard", () => {
  it("shows the interpreted air-quality state instead of its raw reading", () => {
    vi.stubGlobal("EventSource", FakeEventSource);
    const { container } = render(<LiveDashboard stationId="station-01" />);
    const stream = FakeEventSource.instances[0];

    act(() => {
      stream.emit({
        device_id: "station-01",
        air_temperature: 23.45,
        air_pressure: 1,
        air_humidity: 45,
        air_quality: 450.5,
        daylight: 2748,
        latitude: null,
        longitude: null,
        precipitation_interval: 0.5,
        received_at: "2026-09-13T12:00:00.000Z",
      });
    });

    const airQualityCard = container.querySelector(".measurement-air-quality");
    expect(airQualityCard?.textContent).toContain("MODERADA");
    expect(airQualityCard?.textContent).not.toContain("450.50");
    expect(airQualityCard?.textContent).not.toContain("AQI");
    expect(airQualityCard?.getAttribute("style")).toContain(
      "--air-quality-color: var(--color-warning)",
    );
  });
});
