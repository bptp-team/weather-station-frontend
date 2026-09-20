import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("keeps the live interface available while history loads", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain("TRANSMISSÃO METEOROLÓGICA AO VIVO");
    expect(markup).toContain("Monitor meteorológico");
    expect(markup).toContain("conectando");
    expect(markup).toContain("Estação atual");
    expect(markup).toContain("station-01");
    expect(markup).toContain("Última atualização");
    expect(markup).toContain("Aguardando a primeira leitura");
    expect(markup).toContain("Momento do dia");
    expect(markup).toContain('data-testid="history-module-fallback"');
  });
});
