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

export function HumidityChart({ data }: Props) {
  return (
    <HistoryChartShell title="Umidade do ar" description="Intensidade histórica em %">
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
          <YAxis unit="%" tickMargin={10} />
          <Tooltip
            labelFormatter={(value) => formatChartDate(Number(value))}
            formatter={(value) => formatChartValue(Number(value), "%")}
          />
          <Area
            type="monotone"
            dataKey="air_humidity"
            name="Umidade"
            stroke="#17735f"
            fill="#a6ccc0"
            fillOpacity={0.55}
          />
        </AreaChart>
      </ResponsiveContainer>
    </HistoryChartShell>
  );
}
