import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EditorialStatusBadge } from "./EditorialStatusBadge";

describe("EditorialStatusBadge", () => {
  it("shows the planning-draft warning for unverified content", () => {
    render(<EditorialStatusBadge reportingStatus="planning_draft" />);
    expect(screen.getByText(/planning draft/i)).toBeInTheDocument();
  });

  it("does not show the planning-draft warning for verified content", () => {
    render(<EditorialStatusBadge reportingStatus="verified_firsthand" />);
    expect(screen.queryByText(/planning draft/i)).not.toBeInTheDocument();
  });

  it("shows a last-checked date for time-sensitive content", () => {
    render(
      <EditorialStatusBadge
        reportingStatus="verified_firsthand"
        hasTimeSensitiveInfo
        lastCheckedDate="2026-08-20"
      />,
    );
    expect(screen.getByText(/last checked/i)).toBeInTheDocument();
  });

  it("labels seed content distinctly from the editorial workflow badges", () => {
    render(<EditorialStatusBadge reportingStatus="verified_firsthand" isSeedContent />);
    expect(screen.getByText(/sample content/i)).toBeInTheDocument();
  });

  it("renders nothing when content is verified, not time-sensitive, and not seed data", () => {
    const { container } = render(<EditorialStatusBadge reportingStatus="verified_firsthand" />);
    expect(container).toBeEmptyDOMElement();
  });
});
