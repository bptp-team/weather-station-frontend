import { Area, AreaChart } from "recharts";
import { interpretDaylight } from "../../../daylight/daylightInterpreter";
import type { HistoryPoint } from "../../types";
import { HistoryChartFrame } from "../HistoryChartFrame";
import { chartColors, chartOpacities } from "../../../../styles/chartTokens";

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
        stroke={chartColors.daylight}
        fill={chartColors.daylightArea}
        fillOpacity={chartOpacities.daylightArea}
      />
    </HistoryChartFrame>
  );
}
