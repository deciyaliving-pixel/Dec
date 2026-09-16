import { Link, useParams } from "react-router-dom";
import { MOOD_LABELS, REGION_LABELS, SEASON_LABELS } from "@staykhoj/shared";
import { useAsync } from "../hooks/useAsync";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { api } from "../lib/api";
import { EditorialStatusBadge } from "../components/EditorialStatusBadge";
import { MetaStrip } from "../components/MetaStrip";
import { TagChips } from "../components/TagChips";
import { NotFoundPage } from "./NotFoundPage";

export function RouteDetailPage() {
  const { slug = "" } = useParams();
  const { data, loading, error } = useAsync(() => api.routes.get(slug), [slug]);

  useDocumentMeta({
    title: data ? `${data.route.title} — StayKhoj` : "Route — StayKhoj",
    description: data?.route.metaDescription,
  });

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-ink-500 sm:px-6">Loading route&#8230;</div>;
  }
  if (error || !data) {
    return <NotFoundPage />;
  }

  const { route, author } = data;
  const regionSlug = route.regionSlugs[0];

  return (
    <article>
      <div className="relative">
        <div className="aspect-[16/7] w-full overflow-hidden bg-ink-100">
          <img src={route.heroImage} alt={route.heroImageAlt} className="h-full w-full object-cover" />
        </div>
        {route.heroImageCredit && (
          <p className="bg-ink px-4 py-1 text-right text-xs text-paper/70">
            Photo by{" "}
            <a href={route.heroImageCredit.profileUrl} className="underline hover:text-paper">
              {route.heroImageCredit.photographer}
            </a>{" "}
            on Unsplash
          </p>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="kicker">
          {route.durationDays}-Day Route &middot; {REGION_LABELS[regionSlug]}
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{route.title}</h1>
        <p className="mt-4 text-lg text-ink-500">{route.dek}</p>

        <div className="mt-6">
          <MetaStrip authorName={author?.name} publishDate={route.publishDate} />
        </div>

        <div className="mt-4">
          <EditorialStatusBadge
            reportingStatus={route.reportingStatus}
            hasTimeSensitiveInfo={route.hasTimeSensitiveInfo}
            lastCheckedDate={route.lastCheckedDate}
            isSeedContent={route.isSeedContent}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <TagChips labels={route.seasons.map((s) => SEASON_LABELS[s])} tone="vermilion" />
          <TagChips labels={route.moods.map((m) => MOOD_LABELS[m])} />
        </div>

        <div className="prose-body mt-10 space-y-5 font-body text-[1.05rem] leading-relaxed text-ink-700">
          {route.body.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12">
          <p className="kicker mb-4">The Stops</p>
          <ol className="space-y-4">
            {route.stops.map((stop, i) => (
              <li key={stop.name} className="postcard flex gap-4 p-5">
                <span className="stamp h-10 w-10 flex-shrink-0 border-2 border-dashed border-ink/40 font-display">
                  {i + 1}
                </span>
                <div>
                  <p className="font-display text-lg">{stop.name}</p>
                  <p className="mt-1 text-sm text-ink-500">{stop.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <nav aria-label="Related reading" className="mt-14 border-t border-ink/15 pt-8">
          <p className="kicker mb-4">Keep Planning</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li>
              <Link to={`/regions/${regionSlug}`} className="postcard block px-5 py-4 hover:-translate-y-0.5">
                <span className="block text-sm text-ink-500">Regional hub</span>
                <span className="font-display text-lg">{REGION_LABELS[regionSlug]}</span>
              </Link>
            </li>
            {route.relatedPlanningSlug && (
              <li>
                <Link to={route.relatedPlanningSlug} className="postcard block px-5 py-4 hover:-translate-y-0.5">
                  <span className="block text-sm text-ink-500">Plan around the seasons</span>
                  <span className="font-display text-lg">Best Time to Visit India</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </article>
  );
}
