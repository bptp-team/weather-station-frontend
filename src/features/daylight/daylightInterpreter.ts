import { daylightColors, getDaylightRange, type DaylightState } from "./daylightConfig";

export type DaylightInterpretation = {
  state: DaylightState;
  color: string;
};

export function interpretDaylight(reading: number): DaylightInterpretation {
  const range = getDaylightRange(reading);
  return { state: range.state, color: daylightColors[range.state] };
}
