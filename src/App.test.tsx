import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the interface in Brazilian Portuguese and preserves technical values", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain("TRANSMISSÃO METEOROLÓGICA AO VIVO");
    expect(markup).toContain("Monitor meteorológico");
    expect(markup).toContain("conectando");
    expect(markup).toContain("Estação atual");
    expect(markup).toContain("station-01");
    expect(markup).toContain("Última atualização");
    expect(markup).toContain("Aguardando a primeira leitura");
    expect(markup).toContain("Medições meteorológicas");
    expect(markup).toContain("Transmitindo de");

    expect(markup).toContain("Temperatura do ar</span>");
    expect(markup).toContain("Pressão do ar</span>");
    expect(markup).toContain("Umidade do ar</span>");
    expect(markup).toContain("Qualidade do ar</span>");
    expect(markup).toContain("Luz natural</span>");
    expect(markup).toContain("Precipitação (intervalo)</span>");
    expect(markup).toContain("<small>C</small>");
    expect(markup).toContain("<small>atm</small>");
    expect(markup).toContain("<small>%</small>");
    expect(markup).toContain("<small>AQI</small>");
    expect(markup).toContain("<small>lx</small>");
    expect(markup).toContain("<small>mm</small>");
  });
});
