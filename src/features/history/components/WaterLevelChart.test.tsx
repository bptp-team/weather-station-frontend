import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { WaterLevelChart } from "./WaterLevelChart";
import { chartTestData } from "./chartTestData";

describe("WaterLevelChart", () => {
  it("identifies the reading as a raw sensor value", () => {
    const markup = renderToStaticMarkup(<WaterLevelChart data={chartTestData} />);
    expect(markup).toContain("Nível da água");
    expect(markup).toContain("Valor bruto do sensor");
  });
});
