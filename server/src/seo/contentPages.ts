import { buildArticleJsonLd, canEmitArticleJsonLd, REGION_LABELS, type RegionSlug } from "@staykhoj/shared";
import type { ContentRepository } from "../lib/repository.js";
import type { HtmlInjection } from "./htmlInject.js";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Resolves the SEO injection for a given request path, if it matches a known content
 * route. Returns null for anything else (the SPA fallback is served as-is in that case).
 */
export async function resolveContentInjection(
  repo: ContentRepository,
  siteUrl: string,
  path: string,
): Promise<HtmlInjection | null> {
  let match: RegExpMatchArray | null;

  if ((match = path.match(/^\/field-notes\/([^/]+)\/?$/))) {
    const fieldNote = await repo.getFieldNote(match[1]);
    if (!fieldNote) return null;
    const author = await repo.getAuthor(fieldNote.authorId);
    const jsonLd =
      author && canEmitArticleJsonLd(fieldNote, author) ? buildArticleJsonLd(fieldNote, author, siteUrl) : undefined;
    return {
      title: `${fieldNote.title} — StayKhoj`,
      description: fieldNote.metaDescription,
      canonicalPath: fieldNote.canonicalUrl,
      jsonLd,
      fallbackHtml: `<article><h1>${escapeHtml(fieldNote.title)}</h1><p>${escapeHtml(fieldNote.dek)}</p></article>`,
    };
  }

  if ((match = path.match(/^\/routes\/([^/]+)\/?$/))) {
    const route = await repo.getRoute(match[1]);
    if (!route) return null;
    const author = await repo.getAuthor(route.authorId);
    const jsonLd = author && canEmitArticleJsonLd(route, author) ? buildArticleJsonLd(route, author, siteUrl) : undefined;
    return {
      title: `${route.title} — StayKhoj`,
      description: route.metaDescription,
      canonicalPath: route.canonicalUrl,
      jsonLd,
      fallbackHtml: `<article><h1>${escapeHtml(route.title)}</h1><p>${escapeHtml(route.dek)}</p></article>`,
    };
  }

  if ((match = path.match(/^\/regions\/([^/]+)\/destinations\/([^/]+)\/?$/))) {
    const destination = await repo.getDestination(match[2]);
    if (!destination) return null;
    const author = await repo.getAuthor(destination.authorId);
    const jsonLd =
      author && canEmitArticleJsonLd(destination, author) ? buildArticleJsonLd(destination, author, siteUrl) : undefined;
    return {
      title: `${destination.title} — StayKhoj`,
      description: destination.metaDescription,
      canonicalPath: destination.canonicalUrl,
      jsonLd,
      fallbackHtml: `<article><h1>${escapeHtml(destination.title)}</h1><p>${escapeHtml(destination.dek)}</p></article>`,
    };
  }

  if ((match = path.match(/^\/regions\/([^/]+)\/?$/))) {
    const region = await repo.getRegion(match[1]);
    if (!region) return null;
    const destinations = await repo.listDestinations({ status: "published", regionSlug: region.slug });
    const links = destinations
      .map((d) => `<li><a href="/regions/${region.slug}/destinations/${d.slug}">${escapeHtml(d.title)}</a></li>`)
      .join("");
    return {
      title: `${region.name} — StayKhoj`,
      description: region.metaDescription,
      canonicalPath: region.canonicalUrl,
      fallbackHtml: `<article><h1>${escapeHtml(region.name)}</h1><p>${escapeHtml(region.summary)}</p><ul>${links}</ul></article>`,
    };
  }

  if (path === "/map" || path === "/map/") {
    const destinations = await repo.listDestinations({ status: "published" });
    const links = destinations
      .map(
        (d) =>
          `<li><a href="/regions/${d.regionSlugs[0]}/destinations/${d.slug}">${escapeHtml(d.title)}</a> — ${escapeHtml(
            REGION_LABELS[d.regionSlugs[0] as RegionSlug],
          )}</li>`,
      )
      .join("");
    return {
      title: "Destination Map — StayKhoj",
      description:
        "Browse StayKhoj's India destinations by mood and season on an interactive map, with every destination also listed here as plain links.",
      canonicalPath: "/map",
      fallbackHtml: `<section><h1>Destination Map</h1><p>If the interactive map does not load, every destination is listed below.</p><ul>${links}</ul></section>`,
    };
  }

  return null;
}
