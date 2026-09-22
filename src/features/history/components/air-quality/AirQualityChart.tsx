import { Line, LineChart } from "recharts";
import type { HistoryPoint } from "../../types";
import { HistoryChartFrame } from "../HistoryChartFrame";
import { chartColors } from "../../../../styles/chartTokens";

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
        stroke={chartColors.airQuality}
        dot={false}
      />
    </HistoryChartFrame>
  );
}
