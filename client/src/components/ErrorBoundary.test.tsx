import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

function Bomb(): never {
  throw new Error("boom");
}

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary fallback={<p>fallback</p>}>
        <p>content</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("renders the fallback instead of crashing when a child throws", () => {
    render(
      <ErrorBoundary fallback={<p>Map unavailable, see the list below.</p>}>
        <Bomb />
      </ErrorBoundary>,
    );
    expect(screen.getByText(/map unavailable/i)).toBeInTheDocument();
  });
});
