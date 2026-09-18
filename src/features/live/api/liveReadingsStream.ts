const apiBaseUrl = import.meta.env.VITE_WEATHER_API_URL ?? "http://localhost:8000";

export function getLiveReadingsStreamUrl(stationId: string): string {
  return `${apiBaseUrl}/api/v1/readings/${stationId}/stream`;
}

export function createLiveReadingsStream(stationId: string): EventSource {
  return new EventSource(getLiveReadingsStreamUrl(stationId));
}
