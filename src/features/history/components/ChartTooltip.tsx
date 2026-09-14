import { formatDateTime } from "../../../weatherFormatter";

export function formatChartDate(timestamp: number) {
  return formatDateTime(timestamp, {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  });
}

export function formatChartValue(value: number, unit: string) {
  return `${value} ${unit}`;
}
