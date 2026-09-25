import { estimateReadTimeMinutes, MOOD_LABELS, REGION_LABELS, SEASON_LABELS } from "@staykhoj/shared";
import { EditorialStatusBadge } from "../EditorialStatusBadge";
import { TagChips } from "../TagChips";
import type { StudioItem, StudioKind } from "../../studio/types";

export function SeoPreviewPanel({ item }: { item: StudioItem }) {
  const readTime = estimateReadTimeMinutes(item.body || "");
  return (
    <div className="dashed-block bg-paper-light p-5">
      <p className="kicker">Search &amp; Social Preview</p>
      <div className="mt-3 space-y-1">
        <p className="truncate text-base text-[#1a0dab]">{item.title || "Untitled"} &mdash; StayKhoj</p>
        <p className="truncate text-sm text-[#006621]">staykhoj.example{item.canonicalUrl}</p>
        <p className="text-sm text-ink-500">{item.metaDescription || "No meta description yet."}</p>
      </div>
      <p className="mt-3 text-xs text-ink-500">Estimated reading time: {readTime} min (computed from body length)</p>
    </div>
  );
}

export function ContentPreview({ item, kind }: { item: StudioItem; kind: StudioKind }) {
  const regionSlug = item.regionSlugs[0];
  return (
    <article className="postcard p-6">
      {item.heroImage && (
        <div className="mb-6 aspect-[16/7] w-full overflow-hidden rounded-card bg-ink-100">
          <img src={item.heroImage} alt={item.heroImageAlt} className="h-full w-full object-cover" />
        </div>
      )}
      <p className="kicker">{regionSlug ? REGION_LABELS[regionSlug] : "No region selected"}</p>
      <h1 className="mt-3 text-4xl">{item.title || "Untitled"}</h1>
      <p className="mt-4 text-lg text-ink-500">{item.dek || "No dek yet."}</p>

      <div className="mt-4">
        <EditorialStatusBadge
          reportingStatus={item.reportingStatus}
          hasTimeSensitiveInfo={item.hasTimeSensitiveInfo}
          lastCheckedDate={item.lastCheckedDate}
          isSeedContent={item.isSeedContent}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <TagChips labels={item.seasons.map((s) => SEASON_LABELS[s])} tone="vermilion" />
        <TagChips labels={item.moods.map((m) => MOOD_LABELS[m])} />
      </div>

      <div className="prose-body mt-8 space-y-4 text-ink-700">
        {(item.body || "").split("\n\n").filter(Boolean).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        {!item.body && <p className="italic text-ink-300">No body content yet.</p>}
      </div>

      {kind === "destinations" && "whyGo" in item && (
        <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/15">
          {[
            ["Why go", item.whyGo],
            ["Who it suits", item.whoItSuits],
            ["When to visit", item.whenToVisit],
            ["How long to plan", item.howLongToPlan],
            ["How to arrive", item.howToArrive],
            ["Eat, notice, avoid", item.whatToEatNoticeAvoid],
            ["Travel responsibly", item.responsibleTravelNotes],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="text-sm font-semibold uppercase tracking-wide text-ink-500">{label}</dt>
              <dd className="text-ink-700">{value || <span className="italic text-ink-300">Not filled in.</span>}</dd>
            </div>
          ))}
        </dl>
      )}

      {kind === "routes" && "stops" in item && (
        <ol className="mt-10 space-y-3">
          {item.stops.map((stop, i) => (
            <li key={i} className="rounded-card border border-ink/15 p-4">
              <p className="font-display">
                {i + 1}. {stop.name || "Untitled stop"}
              </p>
              <p className="mt-1 text-sm text-ink-500">{stop.description}</p>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}
