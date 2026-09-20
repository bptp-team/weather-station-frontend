import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DaylightChart } from "./DaylightChart";
import { chartTestData } from "../chartTestData";

describe("DaylightChart", () => {
  it("identifies the reading as an interpreted moment of day", () => {
    const markup = renderToStaticMarkup(<DaylightChart data={chartTestData} />);
    expect(markup).toContain("Momento do dia");
    expect(markup).toContain("Classificação direta entre dia e noite");
  });
});
