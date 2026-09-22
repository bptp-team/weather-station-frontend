import { Line, LineChart } from "recharts";
import type { HistoryPoint } from "../../types";
import { HistoryChartFrame } from "../HistoryChartFrame";
import { chartColors } from "../../../../styles/chartTokens";

type Props = { data: HistoryPoint[] };

export function TemperatureChart({ data }: Props) {
  return (
    <HistoryChartFrame
      title="Temperatura do ar"
      description="Variação histórica em °C"
      data={data}
      chartComponent={LineChart}
      axisUnit="°C"
      tooltipUnit="°C"
    >
      <Line
        type="monotone"
        dataKey="air_temperature"
        name="Temperatura"
        stroke={chartColors.temperature}
        dot={false}
      />
    </HistoryChartFrame>
  );
}
