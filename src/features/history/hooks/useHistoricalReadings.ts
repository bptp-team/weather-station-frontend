import { useCallback, useEffect, useRef, useState } from "react";
import { createLiveReadingsStream } from "../../live/api/liveReadingsStream";
import { fetchHistoricalReadings } from "../api/historicalReadingsApi";
import { getHistoryRange, getRangeMilliseconds } from "../dateRanges";
import { mapHistoryPoints, mergeLivePoint, parseLiveHistoryMessage } from "../data/historyMappers";
import type { HistoryPoint, HistoryRange } from "../types";

export function useHistoricalReadings(stationId: string, range: HistoryRange) {
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const rangeMsRef = useRef(getRangeMilliseconds(range));
  rangeMsRef.current = getRangeMilliseconds(range);

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
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar o histórico.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [range, retryKey, stationId]);

  useEffect(() => {
    const eventSource = createLiveReadingsStream(stationId);

    eventSource.onmessage = (event) => {
      setData((previous) => {
        const point = parseLiveHistoryMessage(event.data, stationId);
        if (!point) return previous;
        return mergeLivePoint(previous, point, rangeMsRef.current, Date.now());
      });
    };

    return () => eventSource.close();
  }, [stationId]);

  return { data, isLoading, error, retry };
}
