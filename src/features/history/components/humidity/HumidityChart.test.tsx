import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HumidityChart } from "./HumidityChart";
import { chartTestData } from "../chartTestData";

describe("HumidityChart", () => {
  it("renders its percentage description", () => {
    const markup = renderToStaticMarkup(<HumidityChart data={chartTestData} />);
    expect(markup).toContain("Umidade do ar");
    expect(markup).toContain("%");
  });
});
