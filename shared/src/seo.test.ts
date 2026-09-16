import { describe, expect, it } from "vitest";
import { canEmitArticleJsonLd, estimateReadTimeMinutes } from "./seo.js";
import type { Author } from "./types.js";

const author: Author = { id: "a1", name: "Test Author", bio: "Bio." };

const baseArticle = {
  title: "Test Article",
  metaDescription: "A test article.",
  canonicalUrl: "/field-notes/test",
  heroImage: "/images/test.jpg",
  heroImageAlt: "Test",
  publishDate: "2026-01-01",
  status: "published" as const,
  reportingStatus: "verified_firsthand" as const,
};

describe("canEmitArticleJsonLd", () => {
  it("allows JSON-LD for published, verified content with an author", () => {
    expect(canEmitArticleJsonLd(baseArticle, author)).toBe(true);
  });

  it("blocks JSON-LD for draft content", () => {
    expect(canEmitArticleJsonLd({ ...baseArticle, status: "draft" }, author)).toBe(false);
  });

  it("blocks JSON-LD for unverified planning-draft content", () => {
    expect(canEmitArticleJsonLd({ ...baseArticle, reportingStatus: "planning_draft" }, author)).toBe(false);
  });

  it("blocks JSON-LD when there is no author", () => {
    expect(canEmitArticleJsonLd(baseArticle, undefined)).toBe(false);
  });
});

describe("estimateReadTimeMinutes", () => {
  it("rounds to at least 1 minute for short bodies", () => {
    expect(estimateReadTimeMinutes("A few short words.")).toBe(1);
  });

  it("scales roughly with word count at 200 words per minute", () => {
    const body = Array(400).fill("word").join(" ");
    expect(estimateReadTimeMinutes(body)).toBe(2);
  });
});
