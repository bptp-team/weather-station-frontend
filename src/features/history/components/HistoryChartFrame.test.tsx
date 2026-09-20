import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts");
  const renderChildren = ({ children }: { children?: ReactNode }) => <>{children}</>;

  return {
    ...actual,
    CartesianGrid: () => null,
    ResponsiveContainer: renderChildren,
    Tooltip: ({
      formatter,
      labelFormatter,
    }: {
      formatter?: (value: number) => string;
      labelFormatter?: (value: number) => string;
    }) => (
      <div>
        <span>{labelFormatter?.(Date.parse("2026-09-13T12:00:00.000Z"))}</span>
        <span>{formatter?.(2748)}</span>
      </div>
    ),
    XAxis: () => null,
    YAxis: ({ width }: { width?: string | number }) => <g data-axis-width={width} />,
  };
});

import { HistoryChartFrame } from "./HistoryChartFrame";
import { chartTestData } from "./chartTestData";

function TestChart({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

describe("HistoryChartFrame", () => {
  it("keeps y-axis labels content-aware across chart types", () => {
    const markup = renderToStaticMarkup(
      <HistoryChartFrame
        title="Test chart"
        description="Test description"
        data={chartTestData}
        chartComponent={TestChart}
        tooltipUnit="valor"
      >
        <span>series</span>
      </HistoryChartFrame>,
    );

    expect(markup).toContain("Test chart");
    expect(markup).toContain('data-axis-width="auto"');
  });

  it("keeps the date above the tooltip value", () => {
    const markup = renderToStaticMarkup(
      <HistoryChartFrame
        title="Test chart"
        description="Test description"
        data={chartTestData}
        chartComponent={TestChart}
        tooltipUnit="valor"
      >
        <span>series</span>
      </HistoryChartFrame>,
    );

    expect(markup.indexOf("13/09 12:00")).toBeLessThan(markup.indexOf("2748.00 valor"));
  });

  it("formats the tooltip value with a chart-specific label", () => {
    const markup = renderToStaticMarkup(
      <HistoryChartFrame
        title="Daylight chart"
        description="Daylight description"
        data={chartTestData}
        chartComponent={TestChart}
        tooltipUnit="valor"
        tooltipValueFormatter={() => "NOITE"}
      >
        <span>series</span>
      </HistoryChartFrame>,
    );

    expect(markup).toContain("NOITE");
  });
});
