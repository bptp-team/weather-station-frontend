import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AirQualityChart } from "./AirQualityChart";
import { chartTestData } from "../chartTestData";

describe("AirQualityChart", () => {
  it("keeps the raw sensor series and identifies its interpreted tooltip", () => {
    const markup = renderToStaticMarkup(<AirQualityChart data={chartTestData} />);

    expect(markup).toContain("Qualidade do ar");
    expect(markup).toContain("Classificação entre boa, moderada e ruim");
  });
});
