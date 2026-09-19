import { Area, AreaChart } from "recharts";
import type { HistoryPoint } from "../../types";
import { HistoryChartFrame } from "../HistoryChartFrame";

type Props = { data: HistoryPoint[] };

export function DaylightChart({ data }: Props) {
  return (
    <HistoryChartFrame
      title="Luz natural"
      description="Valor bruto do sensor"
      data={data}
      chartComponent={AreaChart}
      tooltipUnit="valor"
    >
      <Area
        type="monotone"
        dataKey="daylight"
        name="Valor bruto"
        stroke="#b27a24"
        fill="#ead8a6"
        fillOpacity={0.6}
      />
    </HistoryChartFrame>
  );
}
