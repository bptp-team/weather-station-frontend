import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StationLocationCard } from "./StationLocationCard";

describe("StationLocationCard", () => {
  it("places a valid station coordinate pair in the live map card", () => {
    const markup = renderToStaticMarkup(
      <StationLocationCard
        stationId="station-01"
        latitude={-23.20027778}
        longitude={-45.89111111}
      />,
    );

    expect(markup).toContain(
      '<h2 id="station-location-title" class="measurement-heading station-location-heading">',
    );
    expect(markup).toContain('data-testid="station-location-map"');
    expect(markup).toContain('data-latitude="-23.20027778"');
    expect(markup).toContain('data-longitude="-45.89111111"');
    expect(markup).toContain("-23.200278, -45.891111");
  });
});
