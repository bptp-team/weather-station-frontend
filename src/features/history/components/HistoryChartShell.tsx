import type { ReactNode } from "react";

export type ChartPoint = { timestamp: number; [key: string]: number };

type HistoryChartShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function HistoryChartShell({ title, description, children }: HistoryChartShellProps) {
  return (
    <article className="history-chart" aria-label={title}>
      <div className="history-chart-heading">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="history-chart-body">{children}</div>
    </article>
  );
}
