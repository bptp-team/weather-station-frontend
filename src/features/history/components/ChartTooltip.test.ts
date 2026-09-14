import { describe, expect, it } from "vitest";
import { formatDateTime } from "../../../weatherFormatter";
import { formatChartDate } from "./ChartTooltip";

describe("formatChartDate", () => {
  it("uses the shared date formatter for chart labels", () => {
    const timestamp = Date.parse("2026-09-13T12:34:56.000Z");
    const expected = formatDateTime(timestamp, {
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      month: "2-digit",
    });

    expect(formatChartDate(timestamp)).toBe(expected);
  });
});