import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts");
  const renderChildren = ({ children }: { children?: ReactNode }) => <>{children}</>;

  return {
    ...actual,
    CartesianGrid: () => null,
    Line: () => null,
    LineChart: renderChildren,
    ResponsiveContainer: renderChildren,
    Tooltip: () => null,
    XAxis: () => null,
    YAxis: ({ width }: { width?: string | number }) => <g data-axis-width={width} />,
  };
});

import { chartTestData } from "../chartTestData";

describe("TemperatureChart", () => {
  it("renders its title and Celsius description", async () => {
    vi.resetModules();
    const { TemperatureChart } = await import("./TemperatureChart");
    const markup = renderToStaticMarkup(<TemperatureChart data={chartTestData} />);
    expect(markup).toContain("Temperatura do ar");
    expect(markup).toContain("°C");
  });

  it("configures the y axis to size itself from its labels, avoiding clipped labels", async () => {
    vi.resetModules();
    const { TemperatureChart } = await import("./TemperatureChart");
    const markup = renderToStaticMarkup(<TemperatureChart data={chartTestData} />);
    expect(markup).toContain('data-axis-width="auto"');
  });
});
