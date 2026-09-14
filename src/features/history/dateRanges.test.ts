import { describe, expect, it } from "vitest";
import { getHistoryRange } from "./dateRanges";

describe("getHistoryRange", () => {
  const now = new Date("2026-09-13T12:00:00.000Z");

  it.each([
    ["24h", 24],
    ["7d", 7 * 24],
    ["15d", 15 * 24],
  ] as const)("creates a timezone-aware %s interval", (range, expectedHours) => {
    const result = getHistoryRange(range, now);

    expect(result.to.toISOString()).toBe(now.toISOString());
    expect(result.from.toISOString()).toBe(
      new Date(now.getTime() - expectedHours * 60 * 60 * 1000).toISOString(),
    );
    expect(result.from.getTime()).toBeLessThan(result.to.getTime());
  });
});
