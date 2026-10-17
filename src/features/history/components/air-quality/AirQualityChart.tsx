import { Line, LineChart } from "recharts";
import { interpretAirQuality } from "../../../air-quality/airQualityInterpreter";
import type { HistoryPoint } from "../../types";
import { HistoryChartFrame } from "../HistoryChartFrame";
import { chartColors } from "../../../../styles/chartTokens";

type Props = { data: HistoryPoint[] };

export function AirQualityChart({ data }: Props) {
  return (
    <HistoryChartFrame
      title="Qualidade do ar"
      description="Classificação entre boa, moderada e ruim"
      data={data}
      chartComponent={LineChart}
      tooltipUnit="valor"
      tooltipValueFormatter={(value) => interpretAirQuality(value).state}
    >
      <Line
        type="stepAfter"
        dataKey="air_quality"
        name="Valor bruto"
        stroke={chartColors.airQuality}
        dot={false}
      />
    </HistoryChartFrame>
  );
}
