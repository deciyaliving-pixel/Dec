import type { ContentRepository } from "../lib/repository.js";
import { REGION_SLUGS } from "@staykhoj/shared";

export async function buildSitemapXml(repo: ContentRepository, siteUrl: string): Promise<string> {
  const [destinations, fieldNotes, routes] = await Promise.all([
    repo.listDestinations({ status: "published" }),
    repo.listFieldNotes({ status: "published" }),
    repo.listRoutes({ status: "published" }),
  ]);

  const staticPaths = [
    "/",
    "/field-notes",
    "/map",
    "/best-time-to-visit-india",
    "/routes",
    "/about",
    ...REGION_SLUGS.map((slug) => `/regions/${slug}`),
  ];

  const urls = [
    ...staticPaths,
    ...destinations.map((d) => d.canonicalUrl),
    ...fieldNotes.map((f) => f.canonicalUrl),
    ...routes.map((r) => r.canonicalUrl),
  ];

  const body = urls
    .map((path) => `  <url>\n    <loc>${siteUrl}${path}</loc>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function buildRobotsTxt(siteUrl: string): string {
  return `User-agent: *\nAllow: /\nDisallow: /studio\nDisallow: /account\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}
