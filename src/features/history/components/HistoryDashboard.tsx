import { useState } from "react";
import { FeedbackMessage } from "../../../components/FeedbackMessage";
import { historyRangeOptions } from "../dateRanges";
import { useHistoricalReadings } from "../hooks/useHistoricalReadings";
import type { HistoryRange } from "../types";
import {
  AirQualityChart,
  DaylightChart,
  HumidityChart,
  PrecipitationIntervalChart,
  PressureChart,
  TemperatureChart,
} from "./index";

type Props = { stationId: string };

export function HistoryDashboard({ stationId }: Props) {
  const [range, setRange] = useState<HistoryRange>("24h");
  const { data, isLoading, error } = useHistoricalReadings(stationId, range);

  return (
    <section className="history-section" aria-labelledby="history-title">
      <div className="history-header">
        <div>
          <p className="panel-label">Leituras anteriores</p>
          <h2 id="history-title">Histórico meteorológico</h2>
        </div>
        <label className="range-control">
          <span>Período</span>
          <select value={range} onChange={(event) => setRange(event.target.value as HistoryRange)}>
            {historyRangeOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading && <FeedbackMessage>Carregando histórico...</FeedbackMessage>}
      {error && (
        <FeedbackMessage variant="error">Não foi possível mostrar o histórico.</FeedbackMessage>
      )}
      {!isLoading && !error && data.length === 0 && (
        <FeedbackMessage>Nenhuma medição encontrada para este período.</FeedbackMessage>
      )}
      {!isLoading && !error && data.length > 0 && (
        <div className="history-grid">
          <TemperatureChart data={data} />
          <HumidityChart data={data} />
          <PressureChart data={data} />
          <AirQualityChart data={data} />
          <DaylightChart data={data} />
          <PrecipitationIntervalChart data={data} />
        </div>
      )}
    </section>
  );
}
