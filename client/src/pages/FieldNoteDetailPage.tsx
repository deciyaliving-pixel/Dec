import { Link, useParams } from "react-router-dom";
import { FIELD_NOTE_CATEGORY_LABELS, MOOD_LABELS, REGION_LABELS, SEASON_LABELS } from "@staykhoj/shared";
import { useAsync } from "../hooks/useAsync";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { api } from "../lib/api";
import { EditorialStatusBadge } from "../components/EditorialStatusBadge";
import { MetaStrip } from "../components/MetaStrip";
import { TagChips } from "../components/TagChips";
import { NotFoundPage } from "./NotFoundPage";

export function FieldNoteDetailPage() {
  const { slug = "" } = useParams();
  const { data, loading, error } = useAsync(() => api.fieldNotes.get(slug), [slug]);

  useDocumentMeta({
    title: data ? `${data.fieldNote.title} — StayKhoj` : "Field Note — StayKhoj",
    description: data?.fieldNote.metaDescription,
  });

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-ink-500 sm:px-6">Loading field note&#8230;</div>;
  }

  if (error || !data) {
    return <NotFoundPage />;
  }

  const { fieldNote, author } = data;
  const regionSlug = fieldNote.regionSlugs[0];

  return (
    <article>
      <div className="relative">
        <div className="aspect-[16/7] w-full overflow-hidden bg-ink-100">
          <img src={fieldNote.heroImage} alt={fieldNote.heroImageAlt} className="h-full w-full object-cover" />
        </div>
        {fieldNote.heroImageCredit && (
          <p className="bg-ink px-4 py-1 text-right text-xs text-paper/70">
            Photo by{" "}
            <a href={fieldNote.heroImageCredit.profileUrl} className="underline hover:text-paper">
              {fieldNote.heroImageCredit.photographer}
            </a>{" "}
            on Unsplash
          </p>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="kicker">{FIELD_NOTE_CATEGORY_LABELS[fieldNote.category]}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{fieldNote.title}</h1>
        <p className="mt-4 text-lg text-ink-500">{fieldNote.dek}</p>

        <div className="mt-6">
          <MetaStrip
            place={regionSlug ? REGION_LABELS[regionSlug] : undefined}
            authorName={author?.name}
            publishDate={fieldNote.publishDate}
            readTimeMinutes={fieldNote.readTimeMinutes}
          />
        </div>

        <div className="mt-4">
          <EditorialStatusBadge
            reportingStatus={fieldNote.reportingStatus}
            hasTimeSensitiveInfo={fieldNote.hasTimeSensitiveInfo}
            lastCheckedDate={fieldNote.lastCheckedDate}
            isSeedContent={fieldNote.isSeedContent}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <TagChips labels={fieldNote.seasons.map((s) => SEASON_LABELS[s])} tone="vermilion" />
          <TagChips labels={fieldNote.moods.map((m) => MOOD_LABELS[m])} />
        </div>

        <div className="prose-body mt-10 space-y-5 font-body text-[1.05rem] leading-relaxed text-ink-700">
          {fieldNote.body.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <nav aria-label="Related reading" className="mt-14 border-t border-ink/15 pt-8">
          <p className="kicker mb-4">Keep Planning</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {regionSlug && (
              <li>
                <Link to={`/regions/${regionSlug}`} className="postcard block px-5 py-4 hover:-translate-y-0.5">
                  <span className="block text-sm text-ink-500">Regional hub</span>
                  <span className="font-display text-lg">{REGION_LABELS[regionSlug]}</span>
                </Link>
              </li>
            )}
            {fieldNote.relatedPlanningSlug && (
              <li>
                <Link
                  to={fieldNote.relatedPlanningSlug}
                  className="postcard block px-5 py-4 hover:-translate-y-0.5"
                >
                  <span className="block text-sm text-ink-500">Plan around the seasons</span>
                  <span className="font-display text-lg">Best Time to Visit India</span>
                </Link>
              </li>
            )}
            {fieldNote.relatedDestinationSlugs.slice(0, 2).map((destSlug) => (
              <li key={destSlug}>
                <RelatedDestinationLink slug={destSlug} regionSlug={regionSlug} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}

function RelatedDestinationLink({ slug, regionSlug }: { slug: string; regionSlug?: string }) {
  const { data } = useAsync(() => api.destinations.get(slug), [slug]);
  if (!data) return null;
  const href = `/regions/${regionSlug ?? data.destination.regionSlugs[0]}/destinations/${slug}`;
  return (
    <Link to={href} className="postcard block px-5 py-4 hover:-translate-y-0.5">
      <span className="block text-sm text-ink-500">Related destination</span>
      <span className="font-display text-lg">{data.destination.title}</span>
    </Link>
  );
}
