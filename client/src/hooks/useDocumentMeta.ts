import { useEffect } from "react";

interface DocumentMeta {
  title: string;
  description?: string;
}

/**
 * Keeps the tab title/meta description correct on client-side route changes.
 * The initial HTML for content routes is already server-injected with the right
 * meta (see server/src/seo) — this only matters for SPA navigation after that.
 */
export function useDocumentMeta({ title, description }: DocumentMeta): void {
  useEffect(() => {
    document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}
