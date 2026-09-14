import { describe, expect, it } from "vitest";
import { getHistoryRange } from "../dateRanges";

describe("historical readings hook contract", () => {
  it("uses the selected range as a bounded interval", () => {
    const { from, to } = getHistoryRange("15d", new Date("2026-09-13T12:00:00Z"));
    expect(to.getTime() - from.getTime()).toBe(15 * 24 * 60 * 60 * 1000);
  });
});
