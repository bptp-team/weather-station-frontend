import { describe, expect, it } from "vitest";
import { chartColors, chartDimensions, chartOpacities } from "./chartTokens";

describe("chart tokens", () => {
  it("centralizes shared chart dimensions, opacities, and colors", () => {
    expect(chartDimensions.containerHeight).toBe(240);
    expect(chartDimensions.xAxisTickMargin).toBe(12);
    expect(chartDimensions.yAxisTickMargin).toBe(10);
    expect(chartOpacities.humidityArea).toBe(0.55);
    expect(chartOpacities.daylightArea).toBe(0.6);
    expect(chartColors.temperature).toBe("#c65a43");
    expect(chartColors.grid).toBe("#d8e6df");
  });
});
