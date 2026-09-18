import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoryPoint } from "../types";
import { formatChartDate, formatChartValue } from "./ChartTooltip";
import { HistoryChartShell } from "./HistoryChartShell";

type Props = { data: HistoryPoint[] };

export function PressureChart({ data }: Props) {
  return (
    <HistoryChartShell title="Pressão do ar" description="Tendência histórica em atm">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d8e6df" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatChartDate}
            type="number"
            domain={["dataMin", "dataMax"]}
            tickMargin={12}
          />
          <YAxis unit=" atm" tickMargin={10} />
          <Tooltip
            labelFormatter={(value) => formatChartDate(Number(value))}
            formatter={(value) => formatChartValue(Number(value), "atm")}
          />
          <Line
            type="monotone"
            dataKey="air_pressure"
            name="Pressão"
            stroke="#496056"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </HistoryChartShell>
  );
}
