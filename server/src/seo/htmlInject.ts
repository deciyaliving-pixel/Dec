export interface HtmlInjection {
  title: string;
  description: string;
  canonicalPath: string;
  jsonLd?: Record<string, unknown>;
  /** Extra crawlable markup rendered inside #root before the client bundle hydrates over it. */
  fallbackHtml?: string;
  noIndex?: boolean;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Rewrites the built index.html's <head> for a specific content route: real title,
 * meta description, canonical URL, and (when the content qualifies) JSON-LD — plus a
 * server-rendered fallback block inside #root so the page has real crawlable content
 * even before the client bundle hydrates over it. This is a lightweight alternative to
 * full SSR, sufficient for the "real crawlable HTML" requirement without a render server.
 */
export function injectHtml(template: string, siteUrl: string, injection: HtmlInjection): string {
  let html = template;

  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(injection.title)}</title>`);

  html = html.replace(
    /<meta name="description" content=".*?"\s*\/?>/s,
    `<meta name="description" content="${escapeHtml(injection.description)}" />`,
  );

  const canonicalUrl = `${siteUrl}${injection.canonicalPath}`;
  const headExtras: string[] = [`<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`];

  if (injection.noIndex) {
    headExtras.push('<meta name="robots" content="noindex, nofollow" />');
  } else {
    headExtras.push(
      `<meta property="og:title" content="${escapeHtml(injection.title)}" />`,
      `<meta property="og:description" content="${escapeHtml(injection.description)}" />`,
      `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
      '<meta name="twitter:card" content="summary_large_image" />',
    );
  }

  if (injection.jsonLd) {
    headExtras.push(
      `<script type="application/ld+json">${JSON.stringify(injection.jsonLd)}</script>`,
    );
  }

  html = html.replace("</head>", `${headExtras.join("\n    ")}\n  </head>`);

  if (injection.fallbackHtml) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${injection.fallbackHtml}</div>`,
    );
  }

  return html;
}
