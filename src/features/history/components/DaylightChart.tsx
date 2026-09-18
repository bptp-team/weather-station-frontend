import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoryPoint } from "../types";
import { formatChartDate, formatChartValue } from "./ChartTooltip";
import { HistoryChartShell } from "./HistoryChartShell";

type Props = { data: HistoryPoint[] };

export function DaylightChart({ data }: Props) {
  return (
    <HistoryChartShell title="Luz natural" description="Valor bruto do sensor">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d8e6df" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatChartDate}
            type="number"
            domain={["dataMin", "dataMax"]}
            tickMargin={12}
          />
          <YAxis tickMargin={10} />
          <Tooltip
            labelFormatter={(value) => formatChartDate(Number(value))}
            formatter={(value) => formatChartValue(Number(value), "valor")}
          />
          <Area
            type="monotone"
            dataKey="daylight"
            name="Valor bruto"
            stroke="#b27a24"
            fill="#ead8a6"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </HistoryChartShell>
  );
}
