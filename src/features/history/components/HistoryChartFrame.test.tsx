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
    Tooltip: () => null,
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
});
