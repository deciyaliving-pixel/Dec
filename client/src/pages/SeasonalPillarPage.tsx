import { Link } from "react-router-dom";
import { REGION_LABELS, SEASONS, SEASON_LABELS, type Season } from "@staykhoj/shared";
import { useAsync } from "../hooks/useAsync";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { api } from "../lib/api";
import { formatDateShort } from "../lib/format";

const SEASON_COPY: Record<Season, string> = {
  monsoon:
    "India's southwest monsoon runs roughly June through September across most of the country, arriving first on the Kerala coast in early June and withdrawing from the northwest by late September. It's the defining season for the Western Ghats and Meghalaya, where waterfalls and root bridges are at their most dramatic, but it also brings landslides, flooded roads, and closed viewpoints — flexibility matters more than a fixed itinerary.",
  winter:
    "December through February is the most broadly comfortable window for travel across India: dry, mild along the coasts, cold in the mountains. It's peak season for Kerala's backwaters, the Konkan coast, and Meghalaya's clearer trekking conditions — which also means the highest prices and crowds at well-known destinations.",
  summer:
    "March through May brings heat to most of the Indian plains and coast, but it's also the reliable season for Kerala and Western Ghats hill stations like Munnar, where elevation keeps temperatures manageable. Coastal lowland travel is best minimized or timed around early mornings and evenings.",
  shoulder:
    "The shoulder months — essentially the transition weeks around the monsoon's arrival and withdrawal — often give the best balance of green landscapes, thinner crowds, and manageable weather, though conditions can shift quickly and are the hardest to plan around with confidence this far in advance.",
};

export function SeasonalPillarPage() {
  useDocumentMeta({
    title: "Best Time to Visit India — StayKhoj",
    description:
      "A season-by-season guide to travel in India: monsoon, winter, summer, and shoulder season, with links into StayKhoj's regional guides.",
  });

  const regions = useAsync(() => api.regions.list(), []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="kicker">The Flagship Planning Guide</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Best Time to Visit India</h1>
      <p className="mt-4 text-lg text-ink-500">
        India doesn&apos;t have one travel season &mdash; it has at least four, and they don&apos;t line up the same
        way across every region. This guide breaks down what changes by season, region by region.
      </p>
      <p className="mt-3 text-sm text-ink-500">
        Climate patterns referenced here last checked {formatDateShort("2026-08-25")}. Always confirm current
        conditions before booking travel, especially during monsoon months.
      </p>

      <div className="mt-12 space-y-14">
        {SEASONS.map((season) => (
          <section key={season} id={season} className="border-t border-ink/15 pt-8">
            <h2 className="text-3xl">{SEASON_LABELS[season]}</h2>
            <p className="mt-4 text-ink-700">{SEASON_COPY[season]}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {(regions.data ?? []).map((region) => (
                <Link
                  key={region.slug}
                  to={`/regions/${region.slug}`}
                  className="rounded-full border border-ink/25 px-3 py-1.5 text-sm text-ink-500 hover:border-vermilion hover:text-vermilion"
                >
                  {REGION_LABELS[region.slug]}
                </Link>
              ))}
            </div>
            <Link
              to={`/map?season=${season}`}
              className="mt-4 inline-block text-sm font-medium text-vermilion hover:underline"
            >
              See {SEASON_LABELS[season].toLowerCase()} destinations on the map &rarr;
            </Link>
          </section>
        ))}
      </div>
    </div>
  );
}
