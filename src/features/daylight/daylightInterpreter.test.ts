import { describe, expect, it } from "vitest";
import { interpretDaylight } from "./daylightInterpreter";

describe("interpretDaylight", () => {
  it("classifies readings up to the daylight limit as day", () => {
    expect(interpretDaylight(300)).toMatchObject({
      state: "DIA",
      color: "#f4b942",
    });
  });

  it("classifies readings above the daylight limit as night", () => {
    expect(interpretDaylight(3900)).toMatchObject({
      state: "NOITE",
      color: "#172033",
    });
  });
});
