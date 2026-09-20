import { useEffect, useState, type CSSProperties } from "react";
import { formatConnectionState, formatCountdown } from "../../../weatherFormatter";
import { getLiveReadingsStreamUrl } from "../api/liveReadingsStream";
import { useLiveReadings } from "../hooks/useLiveReadings";

const measurementDefinitions = [
  { key: "air_temperature", label: "Temperatura do ar", unit: "C", icon: "TEMP" },
  { key: "air_pressure", label: "Pressão do ar", unit: "atm", icon: "PRES" },
  { key: "air_humidity", label: "Umidade do ar", unit: "%", icon: "HUM" },
  { key: "air_quality", label: "Qualidade do ar", unit: "AQI", icon: "AQ" },
  { key: "daylight", label: "Momento do dia", unit: "", icon: "LDR" },
  { key: "precipitation_interval", label: "Precipitação (intervalo)", unit: "mm", icon: "CHUVA" },
] as const;

type Props = { stationId: string };

export function LiveDashboard({ stationId }: Props) {
  const { snapshot, daylight, connectionState, lastError } = useLiveReadings(stationId);
  const streamUrl = getLiveReadingsStreamUrl(stationId);
  const receivedAt = snapshot?.received_at ?? "Aguardando a primeira leitura";
  const [now, setNow] = useState(() => Date.now());
  const countdown = snapshot ? formatCountdown(snapshot.received_at_raw, now) : "05:00";

  useEffect(() => {
    if (!snapshot) {
      return;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [snapshot]);

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
          <div className="update-meta-row">
            <span>Última atualização:</span>
            <strong>{receivedAt}</strong>
          </div>
          <small className="countdown">Próxima atualização: {countdown}</small>
        </div>
      </section>

      {lastError && <p className="error-message">{lastError}</p>}

      <section className="measurement-grid" aria-label="Medições meteorológicas">
        {measurementDefinitions.map((measurement) => {
          const value =
            measurement.key === "daylight" ? daylight?.state : snapshot?.[measurement.key];
          const daylightStyle =
            measurement.key === "daylight" && daylight
              ? ({ "--daylight-color": daylight.color } as CSSProperties)
              : undefined;
          return (
            <article
              className={`measurement${measurement.key === "daylight" ? " measurement-daylight" : ""}`}
              key={measurement.key}
              style={daylightStyle}
            >
              <div className="measurement-heading">
                <span className="measurement-icon">{measurement.icon}</span>
                <span>{measurement.label}</span>
              </div>
              <p className="measurement-value">
                {value === undefined ? "--" : value}
                {measurement.unit && <small>{measurement.unit}</small>}
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
