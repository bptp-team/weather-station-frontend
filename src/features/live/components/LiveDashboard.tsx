import { useEffect, useState, type CSSProperties } from "react";
import { FeedbackMessage } from "../../../components/FeedbackMessage";
import { formatConnectionState, formatCountdown } from "../../../shared/weather/weatherFormatter";
import { useLiveReadings } from "../hooks/useLiveReadings";
import { StationLocationCard } from "./StationLocationCard";

const measurementDefinitions = [
  { key: "air_temperature", label: "Temperatura do ar", unit: "ºC" },
  { key: "air_pressure", label: "Pressão do ar", unit: "atm" },
  { key: "air_humidity", label: "Umidade do ar", unit: "%" },
  { key: "air_quality", label: "Qualidade do ar", unit: "" },
  { key: "daylight", label: "Momento do dia", unit: "" },
  { key: "precipitation_interval", label: "Precipitação (intervalo)", unit: "mm" },
] as const;

type Props = { stationId: string };

const FORMATTED_READING_INTERVAL = "01:00";

export function LiveDashboard({ stationId }: Props) {
  const { snapshot, daylight, airQuality, connectionState, lastError } = useLiveReadings(stationId);
  const connectionLabel = formatConnectionState(connectionState);
  const receivedAt = snapshot?.received_at ?? "Aguardando a primeira leitura";
  const [now, setNow] = useState(() => Date.now());
  const countdown = snapshot
    ? formatCountdown(snapshot.received_at_raw, now)
    : FORMATTED_READING_INTERVAL;

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
    <div className="live-dashboard">
      <section className="hero-panel" aria-live="polite">
        <div>
          <div className="station-label-row">
            <p className="panel-label">Estação atual</p>
            <div
              className={`connection connection-${connectionState}`}
              role="img"
              aria-label={connectionLabel}
              title={connectionLabel}
            >
              <span className="connection-dot" />
            </div>
          </div>
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

      {lastError && <FeedbackMessage variant="error">{lastError}</FeedbackMessage>}

      <div className="live-overview-grid">
        <section className="measurement-grid" aria-label="Medições meteorológicas">
          {measurementDefinitions.map((measurement) => {
            const value =
              measurement.key === "daylight"
                ? daylight?.state
                : measurement.key === "air_quality"
                  ? airQuality?.state
                  : snapshot?.[measurement.key];
            const statusStyle =
              measurement.key === "daylight" && daylight
                ? ({ "--daylight-color": daylight.color } as CSSProperties)
                : measurement.key === "air_quality" && airQuality
                  ? ({ "--air-quality-color": airQuality.color } as CSSProperties)
                  : undefined;
            const statusClass =
              measurement.key === "daylight"
                ? " measurement-daylight"
                : measurement.key === "air_quality"
                  ? " measurement-air-quality"
                  : "";
            return (
              <article
                className={`measurement${statusClass}`}
                key={measurement.key}
                style={statusStyle}
              >
                <div className="measurement-heading">
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

        <StationLocationCard
          stationId={stationId}
          latitude={snapshot?.latitude ?? null}
          longitude={snapshot?.longitude ?? null}
        />
      </div>
    </div>
  );
}
