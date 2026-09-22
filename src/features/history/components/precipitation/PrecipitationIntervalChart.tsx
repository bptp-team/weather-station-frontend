import { Line, LineChart } from "recharts";
import type { HistoryPoint } from "../../types";
import { HistoryChartFrame } from "../HistoryChartFrame";
import { chartColors } from "../../../../styles/chartTokens";

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
        stroke={chartColors.precipitation}
        dot={false}
      />
    </HistoryChartFrame>
  );
}
