import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PressureChart } from "./PressureChart";
import { chartTestData } from "../chartTestData";

describe("PressureChart", () => {
  it("renders its atmosphere description", () => {
    const markup = renderToStaticMarkup(<PressureChart data={chartTestData} />);
    expect(markup).toContain("Pressão do ar");
    expect(markup).toContain("atm");
  });
});
