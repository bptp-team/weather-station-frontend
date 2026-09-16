import type { HistoryRange } from "./types";

export const historyRangeOptions = [
  { value: "24h", label: "24 horas", milliseconds: 24 * 60 * 60 * 1000 },
  { value: "7d", label: "7 dias", milliseconds: 7 * 24 * 60 * 60 * 1000 },
  { value: "15d", label: "15 dias", milliseconds: 15 * 24 * 60 * 60 * 1000 },
] as const satisfies ReadonlyArray<{ value: HistoryRange; label: string; milliseconds: number }>;

export function getHistoryRange(range: HistoryRange, now = new Date()) {
  const option = historyRangeOptions.find((item) => item.value === range);
  if (!option) {
    throw new Error(`Unsupported history range: ${range}`);
  }

  const to = new Date(now);
  const from = new Date(to.getTime() - option.milliseconds);

  return { from, to };
}

export function getRangeMilliseconds(range: HistoryRange): number {
  const option = historyRangeOptions.find((item) => item.value === range);
  if (!option) {
    throw new Error(`Unsupported history range: ${range}`);
  }

  return option.milliseconds;
}
