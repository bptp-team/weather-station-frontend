import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("weather favicon", () => {
  it("declares the sun-behind-rain emoji as the page favicon", () => {
    const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
    const favicon = readFileSync(new URL("../public/favicon.svg", import.meta.url), "utf8");

    expect(html).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />');
    expect(favicon).toContain("🌦️");
  });
});
