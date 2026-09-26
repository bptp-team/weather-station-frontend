import { useEffect, useState } from "react";
import type { DaylightInterpretation } from "../../daylight/daylightInterpreter";
import { interpretDaylight } from "../../daylight/daylightInterpreter";
import {
  formatWeatherSnapshot,
  type ConnectionState,
  type FormattedWeatherSnapshot,
} from "../../../shared/weather/weatherFormatter";
import { parseWeatherSnapshot } from "../../../shared/weather/weatherSnapshot";
import { createLiveReadingsStream } from "../api/liveReadingsStream";

export function useLiveReadings(stationId: string) {
  const [snapshot, setSnapshot] = useState<FormattedWeatherSnapshot | null>(null);
  const [daylight, setDaylight] = useState<DaylightInterpretation | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = createLiveReadingsStream(stationId);

    setConnectionState("connecting");
    setSnapshot(null);
    setDaylight(null);
    setLastError(null);

    eventSource.onopen = () => {
      setConnectionState("connected");
      setLastError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsedSnapshot = parseWeatherSnapshot(event.data);
        setSnapshot(formatWeatherSnapshot(parsedSnapshot));
        setDaylight(interpretDaylight(parsedSnapshot.daylight));
      } catch {
        setLastError("Não foi possível ler a atualização meteorológica recebida.");
      }
    };

    eventSource.onerror = () => {
      setConnectionState("disconnected");
      setLastError("A atualização ao vivo não está disponível.");
    };

    return () => eventSource.close();
  }, [stationId]);

  return { snapshot, daylight, connectionState, lastError };
}
