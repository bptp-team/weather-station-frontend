import { describe, expect, it } from "vitest";
import { interpretAirQuality } from "./airQualityInterpreter";

describe("interpretAirQuality", () => {
  it("classifies the good range through 400", () => {
    expect(interpretAirQuality(0).state).toBe("BOA");
    expect(interpretAirQuality(400).state).toBe("BOA");
  });

  it("classifies values above 400 through 600 as moderate", () => {
    expect(interpretAirQuality(400.01).state).toBe("MODERADA");
    expect(interpretAirQuality(600).state).toBe("MODERADA");
  });

  it("classifies values above 600 as bad", () => {
    expect(interpretAirQuality(600.01).state).toBe("RUIM");
  });
});
