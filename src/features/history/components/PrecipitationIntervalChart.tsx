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

export function PrecipitationIntervalChart({ data }: Props) {
  return (
    <HistoryChartShell
      title="Precipitação (intervalo)"
      description="Chuva estimada por leitura em mm"
    >
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
          <YAxis unit="mm" tickMargin={10} />
          <Tooltip
            labelFormatter={(value) => formatChartDate(Number(value))}
            formatter={(value) => formatChartValue(Number(value), "mm")}
          />
          <Line
            type="monotone"
            dataKey="precipitation_interval"
            name="Precipitação"
            stroke="#1d7bb5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </HistoryChartShell>
  );
}
