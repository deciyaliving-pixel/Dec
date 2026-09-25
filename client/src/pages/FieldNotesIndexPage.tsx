import { useMemo, useState } from "react";
import {
  FIELD_NOTE_CATEGORIES,
  FIELD_NOTE_CATEGORY_LABELS,
  SEASONS,
  SEASON_LABELS,
  REGION_LABELS,
  type FieldNoteCategory,
  type Season,
} from "@staykhoj/shared";
import { useAsync } from "../hooks/useAsync";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { api } from "../lib/api";
import { PostcardCard } from "../components/PostcardCard";
import { MetaStrip } from "../components/MetaStrip";

export function FieldNotesIndexPage() {
  useDocumentMeta({
    title: "Field Notes — StayKhoj",
    description: "Browse StayKhoj's field notes on Indian destinations, filterable by category and season.",
  });

  const [category, setCategory] = useState<FieldNoteCategory | "all">("all");
  const [season, setSeason] = useState<Season | "all">("all");

  const { data, loading, error } = useAsync(
    () =>
      api.fieldNotes.list({
        category: category === "all" ? undefined : category,
        season: season === "all" ? undefined : season,
      }),
    [category, season],
  );

  const notes = useMemo(() => data ?? [], [data]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="kicker">The Journal</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Field Notes</h1>
      <p className="mt-4 max-w-2xl text-ink-500">
        Dispatches on mountains, coastlines, food trails, and weekend routes across India &mdash; written to help
        you decide, not just to entertain.
      </p>

      <div className="mt-8 flex flex-wrap gap-6">
        <fieldset>
          <legend className="kicker mb-2">Category</legend>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={category === "all"} onClick={() => setCategory("all")} label="All" />
            {FIELD_NOTE_CATEGORIES.map((c) => (
              <FilterChip key={c} active={category === c} onClick={() => setCategory(c)} label={FIELD_NOTE_CATEGORY_LABELS[c]} />
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="kicker mb-2">Season</legend>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={season === "all"} onClick={() => setSeason("all")} label="All" />
            {SEASONS.map((s) => (
              <FilterChip key={s} active={season === s} onClick={() => setSeason(s)} label={SEASON_LABELS[s]} />
            ))}
          </div>
        </fieldset>
      </div>

      {loading && <p className="mt-10 text-ink-500">Loading field notes&#8230;</p>}
      {error && <p className="mt-10 text-vermilion-dark">Couldn&apos;t load field notes right now.</p>}
      {!loading && !error && notes.length === 0 && (
        <p className="mt-10 text-ink-500">No field notes match those filters yet.</p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <PostcardCard
            key={note.slug}
            href={`/field-notes/${note.slug}`}
            image={note.heroImage}
            imageAlt={note.heroImageAlt}
            kicker={FIELD_NOTE_CATEGORY_LABELS[note.category]}
            title={note.title}
            dek={note.dek}
            badge={note.regionSlugs[0] ? REGION_LABELS[note.regionSlugs[0]].split(" ")[0] : undefined}
            meta={<MetaStrip publishDate={note.publishDate} readTimeMinutes={note.readTimeMinutes} />}
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active ? "border-vermilion bg-vermilion text-paper-light" : "border-ink/25 text-ink-500 hover:border-ink/50"
      }`}
    >
      {label}
    </button>
  );
}
