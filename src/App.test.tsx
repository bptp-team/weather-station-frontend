import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("keeps the live interface available while history loads", () => {
    const markup = renderToStaticMarkup(<App />);
    const heroMarkup = markup.match(/<section class="hero-panel"[\s\S]*?<\/section>/)?.[0] ?? "";

    expect(markup).toContain("Conectando");
    expect(markup).toContain("Estação atual");
    expect(heroMarkup).toContain('class="station-label-row"');
    expect(heroMarkup.indexOf("Estação atual")).toBeLessThan(heroMarkup.indexOf("Conectando"));
    expect(markup).toContain("station-01");
    expect(markup).toContain("Última atualização");
    expect(markup).toContain("Aguardando a primeira leitura");
    expect(markup).toContain("Momento do dia");
    expect(markup).toContain("AQI");
    expect(markup).toContain("Localização da estação");
    expect(markup).toContain("Aguardando coordenadas da estação");
    expect(markup).toContain('data-testid="history-module-fallback"');
  });

  it("uses the viewport-height shell so the app stays inside the available screen height", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain('class="app-shell app-shell--viewport"');
  });

  it("places the six live readings beside the full-height station map", () => {
    const markup = renderToStaticMarkup(<App />);
    const overviewMarkup =
      markup.match(/<div class="live-overview-grid">[\s\S]*?<\/section><\/div>/)?.[0] ?? "";

    expect(overviewMarkup).not.toBe("");
    expect(overviewMarkup.match(/class="measurement(?: measurement-daylight)?"/g)).toHaveLength(6);
    expect(overviewMarkup).toContain('class="measurement-grid"');
    expect(overviewMarkup).toContain('class="station-location-section"');
  });

  it("groups live content in a viewport-sized dashboard area", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain('class="live-dashboard"');
  });
});
