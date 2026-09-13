import { useEffect, useState } from "react";
import { formatWeatherSnapshot, type FormattedWeatherSnapshot } from "./weatherFormatter";
import { parseWeatherSnapshot } from "./weatherSnapshot";

type ConnectionState = "connecting" | "connected" | "disconnected";

const selectedStationId = "station-01";
const apiBaseUrl = import.meta.env.VITE_WEATHER_API_URL ?? "http://localhost:8000";
const streamUrl = `${apiBaseUrl}/api/v1/readings/${selectedStationId}/stream`;

const measurementDefinitions = [
  { key: "air_temperature", label: "Air temperature", unit: "C", icon: "TEMP" },
  { key: "air_pressure", label: "Air pressure", unit: "atm", icon: "PRES" },
  { key: "air_humidity", label: "Air humidity", unit: "%", icon: "HUM" },
  { key: "air_quality", label: "Air quality", unit: "AQI", icon: "AQ" },
  { key: "daylight", label: "Daylight", unit: "lx", icon: "LUX" },
  { key: "water_level", label: "Water level", unit: "cm", icon: "WATER" },
] as const;

function App() {
  const [snapshot, setSnapshot] = useState<FormattedWeatherSnapshot | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(streamUrl);

    eventSource.onopen = () => {
      setConnectionState("connected");
      setLastError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        setSnapshot(formatWeatherSnapshot(parseWeatherSnapshot(event.data)));
      } catch {
        setLastError("Received an unreadable weather update.");
      }
    };

    eventSource.onerror = () => {
      setConnectionState("disconnected");
      setLastError("The stream is unavailable. Retrying automatically...");
    };

    return () => eventSource.close();
  }, []);

  const receivedAt = snapshot?.received_at ?? "Waiting for the first snapshot";

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">LIVE WEATHER FEED</p>
          <h1>Station monitor</h1>
        </div>
        <div className={`connection connection-${connectionState}`}>
          <span className="connection-dot" />
          {connectionState}
        </div>
      </header>

      <section className="hero-panel" aria-live="polite">
        <div>
          <p className="panel-label">Current station</p>
          <p className="station-name">{selectedStationId  ?? "No station connected"}</p>
        </div>
        <div className="update-meta">
          <span>Last update</span>
          <strong>{receivedAt}</strong>
        </div>
      </section>

      {lastError && <p className="error-message">{lastError}</p>}

      <section className="measurement-grid" aria-label="Weather measurements">
        {measurementDefinitions.map((measurement) => {
          const value = snapshot?.[measurement.key];
          return (
            <article className="measurement" key={measurement.key}>
              <div className="measurement-heading">
                <span className="measurement-icon">{measurement.icon}</span>
                <span>{measurement.label}</span>
              </div>
              <p className="measurement-value">
                {value === undefined ? "--" : value}
                <small>{measurement.unit}</small>
              </p>
            </article>
          );
        })}
      </section>

      <footer className="footer-note">
        <span />
        Streaming from <code>{streamUrl}</code>
      </footer>
    </main>
  );
}

export default App;
