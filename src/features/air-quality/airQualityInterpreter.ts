import { airQualityColors, getAirQualityRange, type AirQualityState } from "./airQualityConfig";

export type AirQualityInterpretation = {
  state: AirQualityState;
  color: string;
};

export function interpretAirQuality(reading: number): AirQualityInterpretation {
  const range = getAirQualityRange(reading);
  return { state: range.state, color: airQualityColors[range.state] };
}
