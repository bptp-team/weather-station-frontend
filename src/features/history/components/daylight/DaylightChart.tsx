import { Area, AreaChart } from "recharts";
import { formatChartDate } from "../ChartTooltip";
import type { HistoryPoint } from "../../types";
import { HistoryChartFrame } from "../HistoryChartFrame";

type Props = { data: HistoryPoint[] };

type DaylightTooltipProps = {
  active?: boolean;
  label?: number | string;
  payload?: Array<{ payload?: HistoryPoint }>;
};

function DaylightTooltip({ active, label, payload }: DaylightTooltipProps) {
  const point = payload?.[0]?.payload;
  if (!active || !point?.daylight_state) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <strong>{point.daylight_state}</strong>
      <span>{formatChartDate(Number(label))}</span>
    </div>
  );
}

export function DaylightChart({ data }: Props) {
  return (
    <HistoryChartFrame
      title="Momento do dia"
      description="Classificação direta entre dia e noite"
      data={data}
      chartComponent={AreaChart}
      tooltipUnit="valor"
      tooltipContent={<DaylightTooltip />}
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
