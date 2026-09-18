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

export function AirQualityChart({ data }: Props) {
  return (
    <HistoryChartShell title="Qualidade do ar" description="Valor bruto do sensor">
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
          <YAxis tickMargin={10} />
          <Tooltip
            labelFormatter={(value) => formatChartDate(Number(value))}
            formatter={(value) => formatChartValue(Number(value), "valor")}
          />
          <Line
            type="stepAfter"
            dataKey="air_quality"
            name="Valor bruto"
            stroke="#8d3d2e"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </HistoryChartShell>
  );
}
