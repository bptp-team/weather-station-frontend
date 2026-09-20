export type DaylightState = "DIA" | "NOITE";

type DaylightRange = {
  max: number;
  state: DaylightState;
};

export const daylightColors: Record<DaylightState, string> = {
  DIA: "#f4b942",
  NOITE: "#172033",
};

export const daylightConfig: readonly DaylightRange[] = [
  { max: 2000, state: "DIA" },
  { max: 4095, state: "NOITE" },
];

export function getDaylightRange(reading: number): DaylightRange {
  return daylightConfig.find((range) => reading <= range.max) ?? daylightConfig.at(-1)!;
}
