import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { api } from "../lib/api";
import { PostcardCard } from "../components/PostcardCard";
import { MetaStrip } from "../components/MetaStrip";
import { NotFoundPage } from "./NotFoundPage";
import type { RegionSlug } from "@staykhoj/shared";

export function RegionHubPage() {
  const { region = "" } = useParams();
  const regionRes = useAsync(() => api.regions.get(region), [region]);
  const destinations = useAsync(() => api.destinations.list({ region: region as RegionSlug }), [region]);
  const fieldNotes = useAsync(() => api.fieldNotes.list({ region: region as RegionSlug }), [region]);
  const routes = useAsync(() => api.routes.list({ region: region as RegionSlug }), [region]);

  useDocumentMeta({
    title: regionRes.data ? `${regionRes.data.name} — StayKhoj` : "Region — StayKhoj",
    description: regionRes.data?.metaDescription,
  });

  if (regionRes.loading) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-ink-500 sm:px-6">Loading region&#8230;</div>;
  }
  if (regionRes.error || !regionRes.data) {
    return <NotFoundPage />;
  }

  const regionData = regionRes.data;

  return (
    <div>
      <div className="relative">
        <div className="aspect-[16/6] w-full overflow-hidden bg-ink-100">
          <img src={regionData.heroImage} alt={regionData.heroImageAlt} className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-ink/10 to-transparent">
          <div className="mx-auto w-full max-w-6xl px-4 pb-8 text-paper sm:px-6">
            <p className="kicker text-paper-light">Regional Hub</p>
            <h1 className="mt-2 text-4xl sm:text-5xl">{regionData.name}</h1>
            <p className="mt-2 max-w-xl text-paper-light/90">{regionData.tagline}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="text-lg text-ink-700">{regionData.summary}</p>
          </div>
          <div className="dashed-block bg-paper-light p-5">
            <p className="kicker">When to Go</p>
            <p className="mt-2 text-sm text-ink-700">{regionData.seasonalOverview}</p>
            <Link to="/best-time-to-visit-india" className="mt-3 inline-block text-sm font-medium text-vermilion hover:underline">
              Full seasonal guide &rarr;
            </Link>
          </div>
        </div>

        <Section title="Destinations" emptyMessage="No published destinations in this region yet.">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(destinations.data ?? []).map((d) => (
              <PostcardCard
                key={d.slug}
                href={`/regions/${region}/destinations/${d.slug}`}
                image={d.heroImage}
                imageAlt={d.heroImageAlt}
                kicker={regionData.name}
                title={d.title}
                dek={d.dek}
              />
            ))}
          </div>
        </Section>

        <Section title="Field Notes" emptyMessage="No published field notes in this region yet.">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(fieldNotes.data ?? []).map((n) => (
              <PostcardCard
                key={n.slug}
                href={`/field-notes/${n.slug}`}
                image={n.heroImage}
                imageAlt={n.heroImageAlt}
                kicker={regionData.name}
                title={n.title}
                dek={n.dek}
                meta={<MetaStrip publishDate={n.publishDate} readTimeMinutes={n.readTimeMinutes} />}
              />
            ))}
          </div>
        </Section>

        <Section title="Route Guides" emptyMessage="No published route guides in this region yet.">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(routes.data ?? []).map((r) => (
              <PostcardCard
                key={r.slug}
                href={`/routes/${r.slug}`}
                image={r.heroImage}
                imageAlt={r.heroImageAlt}
                kicker={`${r.durationDays}-day route`}
                title={r.title}
                dek={r.dek}
              />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  emptyMessage,
  children,
}: {
  title: string;
  emptyMessage: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-14 border-t border-ink/15 pt-8">
      <h2 className="text-2xl">{title}</h2>
      <div className="mt-6">{children}</div>
      <p className="sr-only">{emptyMessage}</p>
    </section>
  );
}
