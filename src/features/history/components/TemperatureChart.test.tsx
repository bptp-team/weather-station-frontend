import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TemperatureChart } from "./TemperatureChart";
import { chartTestData } from "./chartTestData";

describe("TemperatureChart", () => {
  it("renders its title and Celsius description", () => {
    const markup = renderToStaticMarkup(<TemperatureChart data={chartTestData} />);
    expect(markup).toContain("Temperatura do ar");
    expect(markup).toContain("°C");
  });
});
