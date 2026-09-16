import {
  FIELD_NOTE_CATEGORIES,
  FIELD_NOTE_CATEGORY_LABELS,
  MOODS,
  MOOD_LABELS,
  REGION_SLUGS,
  REGION_LABELS,
  SEASONS,
  SEASON_LABELS,
  type FieldNoteCategory,
  type Mood,
  type RegionSlug,
  type Season,
} from "@staykhoj/shared";
import type { Destination, FieldNote, RouteGuide, RouteStop } from "@staykhoj/shared";
import type { ReactNode } from "react";
import type { StudioItem, StudioKind } from "../../studio/types";

const AUTHOR_OPTIONS = [
  { id: "author-ananya-krishnan", name: "Ananya Krishnan" },
  { id: "author-thomas-mathew", name: "Thomas Mathew" },
  { id: "author-staykhoj-desk", name: "StayKhoj Desk" },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink-700">{label}</span>
      {hint && <span className="ml-2 text-xs text-ink-300">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass = "w-full rounded-card border border-ink/25 bg-paper px-3 py-2 text-ink focus:border-vermilion";
const textareaClass = `${inputClass} min-h-[5rem]`;

function CheckboxGroup<T extends string>({
  options,
  labels,
  selected,
  onChange,
}: {
  options: readonly T[];
  labels: Record<T, string>;
  selected: T[];
  onChange: (next: T[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={(e) =>
              onChange(e.target.checked ? [...selected, opt] : selected.filter((v) => v !== opt))
            }
          />
          {labels[opt]}
        </label>
      ))}
    </div>
  );
}

export function ContentForm({
  kind,
  item,
  isNew,
  onChange,
}: {
  kind: StudioKind;
  item: StudioItem;
  isNew: boolean;
  onChange: (next: StudioItem) => void;
}) {
  function set<K extends keyof StudioItem>(key: K, value: StudioItem[K]) {
    onChange({ ...item, [key]: value });
  }

  const canPublish = item.reportingStatus === "verified_firsthand";

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <input className={inputClass} value={item.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Slug" hint={isNew ? undefined : "locked after creation"}>
          <input className={inputClass} value={item.slug} disabled={!isNew} />
        </Field>
        <Field label="Dek (one-line summary)">
          <input className={inputClass} value={item.dek} onChange={(e) => set("dek", e.target.value)} />
        </Field>
        <Field label="Author">
          <select className={inputClass} value={item.authorId} onChange={(e) => set("authorId", e.target.value)}>
            {AUTHOR_OPTIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Meta description" hint="max 160 characters">
          <textarea
            className={textareaClass}
            maxLength={160}
            value={item.metaDescription}
            onChange={(e) => set("metaDescription", e.target.value)}
          />
        </Field>
        <Field label="Canonical URL">
          <input
            className={inputClass}
            value={item.canonicalUrl}
            onChange={(e) => set("canonicalUrl", e.target.value)}
          />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Hero image URL">
          <input className={inputClass} value={item.heroImage} onChange={(e) => set("heroImage", e.target.value)} />
        </Field>
        <Field label="Hero image alt text">
          <input
            className={inputClass}
            value={item.heroImageAlt}
            onChange={(e) => set("heroImageAlt", e.target.value)}
          />
        </Field>
        <Field label="Publish date">
          <input
            type="date"
            className={inputClass}
            value={item.publishDate}
            onChange={(e) => set("publishDate", e.target.value)}
          />
        </Field>
      </section>

      <section className="space-y-3">
        <Field label="Regions">
          <CheckboxGroup
            options={REGION_SLUGS}
            labels={REGION_LABELS}
            selected={item.regionSlugs as RegionSlug[]}
            onChange={(v) => set("regionSlugs", v)}
          />
        </Field>
        <Field label="Seasons">
          <CheckboxGroup
            options={SEASONS}
            labels={SEASON_LABELS}
            selected={item.seasons as Season[]}
            onChange={(v) => set("seasons", v)}
          />
        </Field>
        <Field label="Moods">
          <CheckboxGroup
            options={MOODS}
            labels={MOOD_LABELS}
            selected={item.moods as Mood[]}
            onChange={(v) => set("moods", v)}
          />
        </Field>
        {kind === "fieldNotes" && "category" in item && (
          <Field label="Category">
            <select
              className={inputClass}
              value={(item as FieldNote).category}
              onChange={(e) => onChange({ ...item, category: e.target.value as FieldNoteCategory } as FieldNote)}
            >
              {FIELD_NOTE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {FIELD_NOTE_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
        )}
      </section>

      <section className="dashed-block bg-paper-light p-5">
        <p className="kicker mb-3">Editorial Status</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First-hand reporting status">
            <select
              className={inputClass}
              value={item.reportingStatus}
              onChange={(e) => set("reportingStatus", e.target.value as StudioItem["reportingStatus"])}
            >
              <option value="planning_draft">Planning draft (pending verification)</option>
              <option value="verified_firsthand">Verified first-hand reporting</option>
            </select>
          </Field>
          <Field label="Content status">
            <select
              className={inputClass}
              value={item.status}
              onChange={(e) => set("status", e.target.value as StudioItem["status"])}
            >
              <option value="draft">Draft</option>
              <option value="preview">Preview</option>
              <option value="published" disabled={!canPublish}>
                Published{!canPublish ? " (requires verified first-hand reporting)" : ""}
              </option>
            </select>
          </Field>
          <Field label="Contains time-sensitive info">
            <input
              type="checkbox"
              checked={item.hasTimeSensitiveInfo}
              onChange={(e) => set("hasTimeSensitiveInfo", e.target.checked)}
            />
          </Field>
          {item.hasTimeSensitiveInfo && (
            <Field label="Last checked date">
              <input
                type="date"
                className={inputClass}
                value={item.lastCheckedDate ?? ""}
                onChange={(e) => set("lastCheckedDate", e.target.value)}
              />
            </Field>
          )}
        </div>
      </section>

      <Field label="Body">
        <textarea
          className={`${textareaClass} min-h-[16rem] font-body`}
          value={item.body}
          onChange={(e) => set("body", e.target.value)}
        />
      </Field>

      {kind === "destinations" && "whyGo" in item && (
        <DestinationFacts item={item as Destination} onChange={onChange} />
      )}

      {kind === "routes" && "stops" in item && <RouteStopsEditor item={item as RouteGuide} onChange={onChange} />}

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Related destination slugs" hint="comma-separated">
          <input
            className={inputClass}
            value={item.relatedDestinationSlugs.join(", ")}
            onChange={(e) =>
              set(
                "relatedDestinationSlugs",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              )
            }
          />
        </Field>
        <Field label="Related planning page">
          <input
            className={inputClass}
            value={item.relatedPlanningSlug ?? ""}
            onChange={(e) => set("relatedPlanningSlug", e.target.value)}
          />
        </Field>
      </section>
    </div>
  );
}

function DestinationFacts({ item, onChange }: { item: Destination; onChange: (next: StudioItem) => void }) {
  function set<K extends keyof Destination>(key: K, value: Destination[K]) {
    onChange({ ...item, [key]: value });
  }
  const rows: Array<[keyof Destination, string]> = [
    ["whyGo", "Why go"],
    ["whoItSuits", "Who it suits"],
    ["whenToVisit", "When to visit"],
    ["howLongToPlan", "How long to plan"],
    ["howToArrive", "How to arrive"],
    ["whatToEatNoticeAvoid", "Eat, notice, avoid"],
    ["responsibleTravelNotes", "Travel responsibly"],
  ];
  return (
    <section className="space-y-4">
      <p className="kicker">Destination Facts</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Latitude">
          <input
            type="number"
            step="any"
            className={inputClass}
            value={item.lat}
            onChange={(e) => set("lat", Number(e.target.value))}
          />
        </Field>
        <Field label="Longitude">
          <input
            type="number"
            step="any"
            className={inputClass}
            value={item.lng}
            onChange={(e) => set("lng", Number(e.target.value))}
          />
        </Field>
      </div>
      {rows.map(([key, label]) => (
        <Field key={key} label={label}>
          <textarea
            className={textareaClass}
            value={item[key] as string}
            onChange={(e) => set(key, e.target.value as never)}
          />
        </Field>
      ))}
    </section>
  );
}

function RouteStopsEditor({ item, onChange }: { item: RouteGuide; onChange: (next: StudioItem) => void }) {
  function updateStop(i: number, patch: Partial<RouteStop>) {
    const stops = item.stops.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    onChange({ ...item, stops });
  }
  function addStop() {
    onChange({ ...item, stops: [...item.stops, { name: "", lat: 0, lng: 0, description: "" }] });
  }
  function removeStop(i: number) {
    onChange({ ...item, stops: item.stops.filter((_, idx) => idx !== i) });
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="kicker">Route Stops</p>
        <Field label="Duration (days)">
          <input
            type="number"
            min={1}
            className={inputClass}
            value={item.durationDays}
            onChange={(e) => onChange({ ...item, durationDays: Number(e.target.value) })}
          />
        </Field>
      </div>
      {item.stops.map((stop, i) => (
        <div key={i} className="rounded-card border border-ink/15 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Stop name">
              <input className={inputClass} value={stop.name} onChange={(e) => updateStop(i, { name: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Lat">
                <input
                  type="number"
                  step="any"
                  className={inputClass}
                  value={stop.lat}
                  onChange={(e) => updateStop(i, { lat: Number(e.target.value) })}
                />
              </Field>
              <Field label="Lng">
                <input
                  type="number"
                  step="any"
                  className={inputClass}
                  value={stop.lng}
                  onChange={(e) => updateStop(i, { lng: Number(e.target.value) })}
                />
              </Field>
            </div>
          </div>
          <Field label="Description">
            <textarea
              className={textareaClass}
              value={stop.description}
              onChange={(e) => updateStop(i, { description: e.target.value })}
            />
          </Field>
          <button type="button" onClick={() => removeStop(i)} className="mt-2 text-sm text-vermilion hover:underline">
            Remove stop
          </button>
        </div>
      ))}
      <button type="button" onClick={addStop} className="text-sm font-medium text-vermilion hover:underline">
        + Add stop
      </button>
    </section>
  );
}
