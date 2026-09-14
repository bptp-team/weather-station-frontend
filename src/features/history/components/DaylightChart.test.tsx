import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DaylightChart } from "./DaylightChart";
import { chartTestData } from "./chartTestData";

describe("DaylightChart", () => {
  it("identifies the reading as a raw sensor value", () => {
    const markup = renderToStaticMarkup(<DaylightChart data={chartTestData} />);
    expect(markup).toContain("Luz natural");
    expect(markup).toContain("Valor bruto do sensor");
  });
});
