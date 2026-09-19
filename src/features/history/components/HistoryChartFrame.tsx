import type { ComponentType, ReactNode } from "react";
import { CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HistoryPoint } from "../types";
import { formatChartDate, formatChartValue } from "./ChartTooltip";
import { HistoryChartShell } from "./HistoryChartShell";

type ChartComponentProps = {
  data: HistoryPoint[];
  children?: ReactNode;
};

type HistoryChartFrameProps = {
  title: string;
  description: string;
  data: HistoryPoint[];
  chartComponent: ComponentType<ChartComponentProps>;
  axisUnit?: string;
  tooltipUnit: string;
  children: ReactNode;
};

export function HistoryChartFrame({
  title,
  description,
  data,
  chartComponent: ChartComponent,
  axisUnit,
  tooltipUnit,
  children,
}: HistoryChartFrameProps) {
  return (
    <HistoryChartShell title={title} description={description}>
      <ResponsiveContainer width="100%" height={240}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d8e6df" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatChartDate}
            type="number"
            domain={["dataMin", "dataMax"]}
            tickMargin={12}
          />
          <YAxis width="auto" unit={axisUnit} tickMargin={10} />
          <Tooltip
            labelFormatter={(value) => formatChartDate(Number(value))}
            formatter={(value) => formatChartValue(Number(value), tooltipUnit)}
          />
          {children}
        </ChartComponent>
      </ResponsiveContainer>
    </HistoryChartShell>
  );
}
