import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("keeps the live interface available while history loads", () => {
    const markup = renderToStaticMarkup(<App />);
    const heroMarkup = markup.match(/<section class="hero-panel"[\s\S]*?<\/section>/)?.[0] ?? "";

    expect(markup).toContain("Monitor meteorológico");
    expect(markup).toContain("Conectando");
    expect(markup).toContain("Estação atual");
    expect(heroMarkup).toContain('class="station-label-row"');
    expect(heroMarkup.indexOf("Estação atual")).toBeLessThan(heroMarkup.indexOf("Conectando"));
    expect(markup).toContain("station-01");
    expect(markup).toContain("Última atualização");
    expect(markup).toContain("Aguardando a primeira leitura");
    expect(markup).toContain("Momento do dia");
    expect(markup).toContain("AQI");
    expect(markup).toContain('data-testid="history-module-fallback"');
  });

  it("uses the viewport-height shell so the app stays inside the available screen height", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain('class="app-shell app-shell--viewport"');
  });
});
