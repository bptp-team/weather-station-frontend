import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PrecipitationIntervalChart } from "./PrecipitationIntervalChart";
import { chartTestData } from "./chartTestData";

describe("PrecipitationIntervalChart", () => {
  it("renders its title and millimeter description", () => {
    const markup = renderToStaticMarkup(<PrecipitationIntervalChart data={chartTestData} />);
    expect(markup).toContain("Precipitação (intervalo)");
    expect(markup).toContain("mm");
  });
});
