import { Link, useParams } from "react-router-dom";
import { MOOD_LABELS, REGION_LABELS, SEASON_LABELS } from "@staykhoj/shared";
import { useAsync } from "../hooks/useAsync";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { api } from "../lib/api";
import { EditorialStatusBadge } from "../components/EditorialStatusBadge";
import { MetaStrip } from "../components/MetaStrip";
import { TagChips } from "../components/TagChips";
import { NotFoundPage } from "./NotFoundPage";

export function DestinationDetailPage() {
  const { region = "", slug = "" } = useParams();
  const { data, loading, error } = useAsync(() => api.destinations.get(slug), [slug]);

  useDocumentMeta({
    title: data ? `${data.destination.title} — StayKhoj` : "Destination — StayKhoj",
    description: data?.destination.metaDescription,
  });

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-ink-500 sm:px-6">Loading destination&#8230;</div>;
  }
  if (error || !data) {
    return <NotFoundPage />;
  }

  const { destination, author } = data;

  return (
    <article>
      <div className="relative">
        <div className="aspect-[16/7] w-full overflow-hidden bg-ink-100">
          <img src={destination.heroImage} alt={destination.heroImageAlt} className="h-full w-full object-cover" />
        </div>
        {destination.heroImageCredit && (
          <p className="bg-ink px-4 py-1 text-right text-xs text-paper/70">
            Photo by{" "}
            <a href={destination.heroImageCredit.profileUrl} className="underline hover:text-paper">
              {destination.heroImageCredit.photographer}
            </a>{" "}
            on Unsplash
          </p>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="kicker">{REGION_LABELS[destination.regionSlugs[0]]}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{destination.title}</h1>
        <p className="mt-4 text-lg text-ink-500">{destination.dek}</p>

        <div className="mt-6">
          <MetaStrip authorName={author?.name} publishDate={destination.publishDate} />
        </div>

        <div className="mt-4">
          <EditorialStatusBadge
            reportingStatus={destination.reportingStatus}
            hasTimeSensitiveInfo={destination.hasTimeSensitiveInfo}
            lastCheckedDate={destination.lastCheckedDate}
            isSeedContent={destination.isSeedContent}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <TagChips labels={destination.seasons.map((s) => SEASON_LABELS[s])} tone="vermilion" />
          <TagChips labels={destination.moods.map((m) => MOOD_LABELS[m])} />
        </div>

        <div className="prose-body mt-10 space-y-5 font-body text-[1.05rem] leading-relaxed text-ink-700">
          {destination.body.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <dl className="mt-12 divide-y divide-ink/10 border-y border-ink/15">
          <FactRow label="Why go">{destination.whyGo}</FactRow>
          <FactRow label="Who it suits">{destination.whoItSuits}</FactRow>
          <FactRow label="When to visit">{destination.whenToVisit}</FactRow>
          <FactRow label="How long to plan">{destination.howLongToPlan}</FactRow>
          <FactRow label="How to arrive">{destination.howToArrive}</FactRow>
          <FactRow label="Eat, notice, avoid">{destination.whatToEatNoticeAvoid}</FactRow>
          <FactRow label="Travel responsibly">{destination.responsibleTravelNotes}</FactRow>
        </dl>

        <p className="mt-6 text-sm text-ink-500">
          <Link to="/map" className="font-medium text-vermilion hover:underline">
            View on the destination map
          </Link>{" "}
          ({destination.lat.toFixed(3)}, {destination.lng.toFixed(3)})
        </p>

        <nav aria-label="Related reading" className="mt-14 border-t border-ink/15 pt-8">
          <p className="kicker mb-4">Keep Planning</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li>
              <Link to={`/regions/${region}`} className="postcard block px-5 py-4 hover:-translate-y-0.5">
                <span className="block text-sm text-ink-500">Regional hub</span>
                <span className="font-display text-lg">{REGION_LABELS[destination.regionSlugs[0]]}</span>
              </Link>
            </li>
            {destination.relatedPlanningSlug && (
              <li>
                <Link to={destination.relatedPlanningSlug} className="postcard block px-5 py-4 hover:-translate-y-0.5">
                  <span className="block text-sm text-ink-500">Plan around the seasons</span>
                  <span className="font-display text-lg">Best Time to Visit India</span>
                </Link>
              </li>
            )}
            {destination.relatedDestinationSlugs.slice(0, 2).map((destSlug) => (
              <li key={destSlug}>
                <RelatedDestinationLink slug={destSlug} regionSlug={region} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}

function FactRow({ label, children }: { label: string; children: string }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
      <dt className="text-sm font-semibold uppercase tracking-wide text-ink-500">{label}</dt>
      <dd className="text-ink-700">{children}</dd>
    </div>
  );
}

function RelatedDestinationLink({ slug, regionSlug }: { slug: string; regionSlug: string }) {
  const { data } = useAsync(() => api.destinations.get(slug), [slug]);
  if (!data) return null;
  return (
    <Link to={`/regions/${regionSlug}/destinations/${slug}`} className="postcard block px-5 py-4 hover:-translate-y-0.5">
      <span className="block text-sm text-ink-500">Related destination</span>
      <span className="font-display text-lg">{data.destination.title}</span>
    </Link>
  );
}
