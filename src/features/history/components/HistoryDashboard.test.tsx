import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("../hooks/useHistoricalReadings", () => ({
  useHistoricalReadings: () => ({ data: [], isLoading: false, error: null }),
}));

import { HistoryDashboard } from "./HistoryDashboard";

describe("HistoryDashboard", () => {
  it("keeps the history panel and period control without the previous-readings label", () => {
    const markup = renderToStaticMarkup(<HistoryDashboard stationId="station-01" />);

    expect(markup).toContain("Histórico");
    expect(markup).toContain("Período");
    expect(markup).toContain("Nenhuma medição encontrada para este período.");
  });
});
