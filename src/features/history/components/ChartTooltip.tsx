export function formatChartDate(timestamp: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  }).format(new Date(timestamp));
}

export function formatChartValue(value: number, unit: string) {
  return `${value} ${unit}`;
}
