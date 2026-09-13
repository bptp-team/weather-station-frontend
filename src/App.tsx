import { useEffect, useState } from "react";
import {
  formatConnectionState,
  formatWeatherSnapshot,
  type ConnectionState,
  type FormattedWeatherSnapshot,
} from "./weatherFormatter";
import { parseWeatherSnapshot } from "./weatherSnapshot";

const selectedStationId = "station-01";
const apiBaseUrl = import.meta.env.VITE_WEATHER_API_URL ?? "http://localhost:8000";
const streamUrl = `${apiBaseUrl}/api/v1/readings/${selectedStationId}/stream`;

const measurementDefinitions = [
  { key: "air_temperature", label: "Temperatura do ar", unit: "C", icon: "TEMP" },
  { key: "air_pressure", label: "Pressão do ar", unit: "atm", icon: "PRES" },
  { key: "air_humidity", label: "Umidade do ar", unit: "%", icon: "HUM" },
  { key: "air_quality", label: "Qualidade do ar", unit: "AQI", icon: "AQ" },
  { key: "daylight", label: "Luz natural", unit: "lx", icon: "LUX" },
  { key: "water_level", label: "Nível da água", unit: "cm", icon: "WATER" },
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
        setLastError("Não foi possível ler a atualização meteorológica recebida.");
      }
    };

    eventSource.onerror = () => {
      setConnectionState("disconnected");
      setLastError("O fluxo está indisponível. Tentando novamente...");
    };

    return () => eventSource.close();
  }, []);

  const receivedAt = snapshot?.received_at ?? "Aguardando a primeira leitura";

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">TRANSMISSÃO METEOROLÓGICA AO VIVO</p>
          <h1>Monitor de estações meteorológicas</h1>
        </div>
        <div className={`connection connection-${connectionState}`}>
          <span className="connection-dot" />
          {formatConnectionState(connectionState)}
        </div>
      </header>

      <section className="hero-panel" aria-live="polite">
        <div>
          <p className="panel-label">Estação atual</p>
          <p className="station-name">{selectedStationId ?? "Nenhuma estação conectada"}</p>
        </div>
        <div className="update-meta">
          <span>Última atualização</span>
          <strong>{receivedAt}</strong>
        </div>
      </section>

      {lastError && <p className="error-message">{lastError}</p>}

      <section className="measurement-grid" aria-label="Medições meteorológicas">
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
        Transmitindo de <code>{streamUrl}</code>
      </footer>
    </main>
  );
}

export default App;
