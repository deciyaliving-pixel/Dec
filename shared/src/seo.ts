import type { Author, Destination, FieldNote, RouteGuide } from "./types.js";

export interface ArticleLike {
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  heroImage: string;
  heroImageAlt: string;
  publishDate: string;
  lastCheckedDate?: string;
  status: "draft" | "preview" | "published";
  reportingStatus: "planning_draft" | "verified_firsthand";
}

/**
 * JSON-LD structured data must only ever be emitted for content that genuinely meets
 * the requirements: published, with a real author/date/image and verified reporting.
 * Anything else (drafts, previews, unverified planning content) gets no structured data.
 */
export function canEmitArticleJsonLd(article: ArticleLike, author: Author | undefined): boolean {
  return (
    article.status === "published" &&
    article.reportingStatus === "verified_firsthand" &&
    Boolean(author) &&
    Boolean(article.publishDate) &&
    Boolean(article.heroImage)
  );
}

export function buildArticleJsonLd(
  article: ArticleLike,
  author: Author,
  siteUrl: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    image: article.heroImage.startsWith("http") ? article.heroImage : `${siteUrl}${article.heroImage}`,
    author: {
      "@type": "Person",
      name: author.name,
    },
    datePublished: article.publishDate,
    dateModified: article.lastCheckedDate ?? article.publishDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.canonicalUrl,
    },
  };
}

export function estimateReadTimeMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export type PublishableContent = Destination | FieldNote | RouteGuide;

/** Draft/preview content must never be reachable via a public URL or indexed. */
export function isPublicallyVisible(content: Pick<PublishableContent, "status">): boolean {
  return content.status === "published";
}
