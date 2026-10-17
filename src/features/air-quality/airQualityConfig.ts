export type AirQualityState = "BOA" | "MODERADA" | "RUIM";

type AirQualityRange = {
  max: number;
  state: AirQualityState;
};

export const airQualityColors: Record<AirQualityState, string> = {
  BOA: "var(--color-success)",
  MODERADA: "var(--color-warning)",
  RUIM: "var(--color-error)",
};

export const airQualityConfig: readonly AirQualityRange[] = [
  { max: 400, state: "BOA" },
  { max: 600, state: "MODERADA" },
  { max: Number.POSITIVE_INFINITY, state: "RUIM" },
];

export function getAirQualityRange(reading: number): AirQualityRange {
  return airQualityConfig.find((range) => reading <= range.max) ?? airQualityConfig.at(-1)!;
}
