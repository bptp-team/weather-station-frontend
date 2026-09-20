import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FeedbackMessage } from "./FeedbackMessage";

describe("FeedbackMessage", () => {
  it("renders the shared feedback block with the error style", () => {
    const markup = renderToStaticMarkup(
      <FeedbackMessage variant="error">Não foi possível mostrar o histórico.</FeedbackMessage>,
    );

    expect(markup).toContain('class="feedback-message feedback-message--error"');
    expect(markup).toContain("Não foi possível mostrar o histórico.");
  });
});
