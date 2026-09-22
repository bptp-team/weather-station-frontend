import { Line, LineChart } from "recharts";
import type { HistoryPoint } from "../../types";
import { HistoryChartFrame } from "../HistoryChartFrame";
import { chartColors } from "../../../../styles/chartTokens";

type Props = { data: HistoryPoint[] };

export function PressureChart({ data }: Props) {
  return (
    <HistoryChartFrame
      title="Pressão do ar"
      description="Tendência histórica em atm"
      data={data}
      chartComponent={LineChart}
      axisUnit=" atm"
      tooltipUnit="atm"
    >
      <Line
        type="monotone"
        dataKey="air_pressure"
        name="Pressão"
        stroke={chartColors.pressure}
        dot={false}
      />
    </HistoryChartFrame>
  );
}
