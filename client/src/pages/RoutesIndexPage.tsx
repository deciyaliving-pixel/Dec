import { REGION_LABELS } from "@staykhoj/shared";
import { useAsync } from "../hooks/useAsync";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { api } from "../lib/api";
import { PostcardCard } from "../components/PostcardCard";

export function RoutesIndexPage() {
  useDocumentMeta({
    title: "Route Guides — StayKhoj",
    description: "Curated multi-stop road trip and travel routes across India, from coastal drives to highland loops.",
  });

  const { data, loading, error } = useAsync(() => api.routes.list(), []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="kicker">Plan the Drive</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Route Guides</h1>
      <p className="mt-4 max-w-2xl text-ink-500">
        Multi-stop itineraries built around how long a trip actually takes, not just which places to tick off.
      </p>

      {loading && <p className="mt-10 text-ink-500">Loading routes&#8230;</p>}
      {error && <p className="mt-10 text-vermilion-dark">Couldn&apos;t load routes right now.</p>}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((route) => (
          <PostcardCard
            key={route.slug}
            href={`/routes/${route.slug}`}
            image={route.heroImage}
            imageAlt={route.heroImageAlt}
            kicker={`${route.durationDays}-day route · ${REGION_LABELS[route.regionSlugs[0]]}`}
            title={route.title}
            dek={route.dek}
          />
        ))}
      </div>
    </div>
  );
}
