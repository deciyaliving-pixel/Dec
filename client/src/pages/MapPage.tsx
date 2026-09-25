import { useSearchParams, Link } from "react-router-dom";
import {
  MOODS,
  MOOD_LABELS,
  REGION_LABELS,
  SEASONS,
  SEASON_LABELS,
  type Mood,
  type RegionSlug,
  type Season,
} from "@staykhoj/shared";
import { useAsync } from "../hooks/useAsync";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { api } from "../lib/api";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { InteractiveMap } from "../components/InteractiveMap";

export function MapPage() {
  useDocumentMeta({
    title: "Destination Map — StayKhoj",
    description:
      "Browse StayKhoj's India destinations by mood and season on an interactive map, with every destination also listed as plain links.",
  });

  const [params, setParams] = useSearchParams();
  const mood = (params.get("mood") as Mood | null) ?? undefined;
  const season = (params.get("season") as Season | null) ?? undefined;

  const { data, loading, error } = useAsync(() => api.destinations.list({ mood, season }), [mood, season]);
  const destinations = data ?? [];

  const byRegion = destinations.reduce<Record<string, typeof destinations>>((acc, d) => {
    const key = d.regionSlugs[0];
    acc[key] = acc[key] ?? [];
    acc[key].push(d);
    return acc;
  }, {});

  function setFilter(key: "mood" | "season", value: string | undefined) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="kicker">Explore</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Destination Map</h1>
      <p className="mt-4 max-w-2xl text-ink-500">
        Filter by mood and season to find a destination that fits your dates. If the map doesn&apos;t load, every
        destination is also listed below as plain links.
      </p>

      <div className="mt-8 flex flex-wrap gap-6">
        <fieldset>
          <legend className="kicker mb-2">Mood</legend>
          <div className="flex flex-wrap gap-2">
            <Chip active={!mood} label="All" onClick={() => setFilter("mood", undefined)} />
            {MOODS.map((m) => (
              <Chip key={m} active={mood === m} label={MOOD_LABELS[m]} onClick={() => setFilter("mood", m)} />
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="kicker mb-2">Season</legend>
          <div className="flex flex-wrap gap-2">
            <Chip active={!season} label="All" onClick={() => setFilter("season", undefined)} />
            {SEASONS.map((s) => (
              <Chip key={s} active={season === s} label={SEASON_LABELS[s]} onClick={() => setFilter("season", s)} />
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-8 h-[28rem] overflow-hidden rounded-card border-2 border-dashed border-ink/30 sm:h-[32rem]">
        {loading && <div className="flex h-full items-center justify-center text-ink-500">Loading map&#8230;</div>}
        {!loading && !error && (
          <ErrorBoundary fallback={<MapUnavailableNotice />}>
            <InteractiveMap destinations={destinations} />
          </ErrorBoundary>
        )}
        {error && <MapUnavailableNotice />}
      </div>

      <section aria-labelledby="destination-list-heading" className="mt-14 border-t border-ink/15 pt-8">
        <h2 id="destination-list-heading" className="text-2xl">
          All Destinations
        </h2>
        {destinations.length === 0 && !loading ? (
          <p className="mt-4 text-ink-500">No destinations match those filters yet.</p>
        ) : (
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(byRegion).map(([regionSlug, items]) => (
              <div key={regionSlug}>
                <h3 className="font-display text-lg">{REGION_LABELS[regionSlug as RegionSlug]}</h3>
                <ul className="mt-3 space-y-2">
                  {items.map((d) => (
                    <li key={d.slug}>
                      <Link
                        to={`/regions/${regionSlug}/destinations/${d.slug}`}
                        className="text-ink-700 underline decoration-ink/30 underline-offset-4 hover:text-vermilion hover:decoration-vermilion"
                      >
                        {d.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
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

function MapUnavailableNotice() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-paper-dark/40 px-6 text-center text-ink-500">
      <p className="font-medium">The interactive map couldn&apos;t load.</p>
      <p className="text-sm">Every destination is still listed below.</p>
    </div>
  );
}
