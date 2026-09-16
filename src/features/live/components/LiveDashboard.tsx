import { formatConnectionState } from "../../../weatherFormatter";
import { getLiveReadingsStreamUrl } from "../api/liveReadingsStream";
import { useLiveReadings } from "../hooks/useLiveReadings";

const measurementDefinitions = [
  { key: "air_temperature", label: "Temperatura do ar", unit: "C", icon: "TEMP" },
  { key: "air_pressure", label: "Pressão do ar", unit: "atm", icon: "PRES" },
  { key: "air_humidity", label: "Umidade do ar", unit: "%", icon: "HUM" },
  { key: "air_quality", label: "Qualidade do ar", unit: "AQI", icon: "AQ" },
  { key: "daylight", label: "Luz natural", unit: "lx", icon: "LUX" },
  { key: "precipitation_interval", label: "Precipitação (intervalo)", unit: "mm", icon: "CHUVA" },
] as const;

type Props = { stationId: string };

export function LiveDashboard({ stationId }: Props) {
  const { snapshot, connectionState, lastError } = useLiveReadings(stationId);
  const streamUrl = getLiveReadingsStreamUrl(stationId);
  const receivedAt = snapshot?.received_at ?? "Aguardando a primeira leitura";

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">TRANSMISSÃO METEOROLÓGICA AO VIVO</p>
          <h1>Monitor meteorológico</h1>
        </div>
        <div className={`connection connection-${connectionState}`}>
          <span className="connection-dot" />
          {formatConnectionState(connectionState)}
        </div>
      </header>

      <section className="hero-panel" aria-live="polite">
        <div>
          <p className="panel-label">Estação atual</p>
          <p className="station-name">{stationId || "Nenhuma estação conectada"}</p>
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
        Transmitindo de {streamUrl}
      </footer>
    </>
  );
}