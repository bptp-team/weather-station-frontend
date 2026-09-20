import { Area, AreaChart } from "recharts";
import { interpretDaylight } from "../../../daylight/daylightInterpreter";
import type { HistoryPoint } from "../../types";
import { HistoryChartFrame } from "../HistoryChartFrame";

type Props = { data: HistoryPoint[] };

export function DaylightChart({ data }: Props) {
  return (
    <HistoryChartFrame
      title="Momento do dia"
      description="Classificação direta entre dia e noite"
      data={data}
      chartComponent={AreaChart}
      tooltipUnit="valor"
      tooltipValueFormatter={(value) => interpretDaylight(value).state}
    >
      <Area
        type="monotone"
        dataKey="daylight"
        name="LDR"
        stroke="#b27a24"
        fill="#ead8a6"
        fillOpacity={0.6}
      />
    </HistoryChartFrame>
  );
}
