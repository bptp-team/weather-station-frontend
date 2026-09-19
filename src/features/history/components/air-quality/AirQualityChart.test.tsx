import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AirQualityChart } from "./AirQualityChart";
import { chartTestData } from "../chartTestData";

describe("AirQualityChart", () => {
  it("identifies the reading as a raw sensor value", () => {
    const markup = renderToStaticMarkup(<AirQualityChart data={chartTestData} />);
    expect(markup).toContain("Qualidade do ar");
    expect(markup).toContain("Valor bruto do sensor");
  });
});
