import { Line, LineChart } from "recharts";
import type { HistoryPoint } from "../../types";
import { HistoryChartFrame } from "../HistoryChartFrame";

type Props = { data: HistoryPoint[] };

export function PrecipitationIntervalChart({ data }: Props) {
  return (
    <HistoryChartFrame
      title="Precipitação (intervalo)"
      description="Chuva estimada por leitura em mm"
      data={data}
      chartComponent={LineChart}
      axisUnit="mm"
      tooltipUnit="mm"
    >
      <Line
        type="monotone"
        dataKey="precipitation_interval"
        name="Precipitação"
        stroke="#1d7bb5"
        dot={false}
      />
    </HistoryChartFrame>
  );
}
