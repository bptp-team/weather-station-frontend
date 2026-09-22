import { Area, AreaChart } from "recharts";
import type { HistoryPoint } from "../../types";
import { HistoryChartFrame } from "../HistoryChartFrame";
import { chartColors, chartOpacities } from "../../../../styles/chartTokens";

type Props = { data: HistoryPoint[] };

export function HumidityChart({ data }: Props) {
  return (
    <HistoryChartFrame
      title="Umidade do ar"
      description="Intensidade histórica em %"
      data={data}
      chartComponent={AreaChart}
      axisUnit="%"
      tooltipUnit="%"
    >
      <Area
        type="monotone"
        dataKey="air_humidity"
        name="Umidade"
        stroke={chartColors.humidity}
        fill={chartColors.humidityArea}
        fillOpacity={chartOpacities.humidityArea}
      />
    </HistoryChartFrame>
  );
}
