export const chartColors = {
  grid: "#d8e6df",
  temperature: "#c65a43",
  humidity: "#17735f",
  humidityArea: "#a6ccc0",
  pressure: "#496056",
  airQuality: "#8d3d2e",
  daylight: "#b27a24",
  daylightArea: "#ead8a6",
  precipitation: "#1d7bb5",
} as const;

export const chartDimensions = {
  containerHeight: 240,
  xAxisTickMargin: 12,
  yAxisTickMargin: 10,
} as const;

export const chartOpacities = {
  humidityArea: 0.55,
  daylightArea: 0.6,
} as const;
