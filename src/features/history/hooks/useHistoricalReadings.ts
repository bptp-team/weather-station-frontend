import { useCallback, useEffect, useState } from "react";
import { fetchHistoricalReadings } from "../api/historicalReadingsApi";
import { getHistoryRange } from "../dateRanges";
import { mapHistoryPoints } from "../data/historyMappers";
import type { HistoryPoint, HistoryRange } from "../types";

export function useHistoricalReadings(stationId: string, range: HistoryRange) {
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const retry = useCallback(() => setRetryKey((key) => key + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    const { from, to } = getHistoryRange(range);
    setIsLoading(true);
    setError(null);

    fetchHistoricalReadings(stationId, from, to, controller.signal)
      .then((readings) => setData(mapHistoryPoints(readings)))
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return;
        setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar o histórico.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [range, retryKey, stationId]);

  return { data, isLoading, error, retry };
}
