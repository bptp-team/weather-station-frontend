import { Line, LineChart } from "recharts";
import type { HistoryPoint } from "../../types";
import { HistoryChartFrame } from "../HistoryChartFrame";

type Props = { data: HistoryPoint[] };

export function AirQualityChart({ data }: Props) {
  return (
    <HistoryChartFrame
      title="Qualidade do ar"
      description="Valor bruto do sensor"
      data={data}
      chartComponent={LineChart}
      tooltipUnit="valor"
    >
      <Line
        type="stepAfter"
        dataKey="air_quality"
        name="Valor bruto"
        stroke="#8d3d2e"
        dot={false}
      />
    </HistoryChartFrame>
  );
}
