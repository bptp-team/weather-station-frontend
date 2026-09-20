import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "info" | "error";
};

export function FeedbackMessage({ children, variant = "info" }: Props) {
  return <div className={`feedback-message feedback-message--${variant}`}>{children}</div>;
}
