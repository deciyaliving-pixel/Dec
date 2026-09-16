import { Link } from "react-router-dom";
import { FIELD_NOTE_CATEGORY_LABELS, REGION_LABELS } from "@staykhoj/shared";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import { PostcardCard } from "../components/PostcardCard";
import { MetaStrip } from "../components/MetaStrip";
import { NewsletterSignup } from "../components/NewsletterSignup";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1776180040561-b0776ed2d3a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920";

export function HomePage() {
  useDocumentMeta({
    title: "StayKhoj — an India travel journal",
    description:
      "StayKhoj is an India-focused travel journal: field notes, seasonal planning, regional route guides, food trails, and a visual destination map.",
  });

  const fieldNotes = useAsync(() => api.fieldNotes.list(), []);
  const regions = useAsync(() => api.regions.list(), []);

  const featured = fieldNotes.data?.slice(0, 6) ?? [];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink/15">
        <img
          src={HERO_IMAGE}
          alt="Cascading monsoon waterfalls through the green hills of the Western Ghats"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/55" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-paper sm:px-6 sm:py-32">
          <p className="kicker text-paper-light">Issue 04 &middot; Monsoon Routes</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-6xl">
            Where to go, when to go, and how to travel India a little more thoughtfully
          </h1>
          <p className="mt-5 max-w-xl text-lg text-paper-light/90">
            Field notes, seasonal planning, and route guides from the Western Ghats to Meghalaya &mdash; built for
            deciding your next trip, not just admiring photos of it.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/field-notes"
              className="rounded-card bg-vermilion px-5 py-3 font-medium text-paper-light transition-colors hover:bg-vermilion-dark"
            >
              Read the field notes
            </Link>
            <Link
              to="/map"
              className="rounded-card border-2 border-dashed border-paper/60 px-5 py-3 font-medium text-paper transition-colors hover:border-paper"
            >
              Explore the map
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="kicker">Latest Field Notes</p>
            <h2 className="mt-2 text-3xl">Fresh from the desk</h2>
          </div>
          <Link to="/field-notes" className="hidden text-sm font-medium text-vermilion hover:underline sm:block">
            All field notes &rarr;
          </Link>
        </div>

        {fieldNotes.loading && <p className="mt-8 text-ink-500">Loading field notes&#8230;</p>}
        {fieldNotes.error && (
          <p className="mt-8 text-vermilion-dark">Couldn&apos;t load field notes right now. Please try again.</p>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((note) => (
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
      </section>

      <section className="border-y border-ink/15 bg-paper-dark/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="kicker">The Destination Map</p>
            <h2 className="mt-2 text-3xl">Every place, plotted by mood and season</h2>
            <p className="mt-4 text-ink-500">
              Filter by Nature &amp; Adventure, Food &amp; Culture, or a Weekend Escape, and by season &mdash;
              Monsoon, Winter, or Shoulder &mdash; to find a destination that fits your dates, not just your bucket
              list.
            </p>
            <Link
              to="/map"
              className="mt-6 inline-block rounded-card bg-ink px-5 py-3 font-medium text-paper transition-colors hover:bg-ink-700"
            >
              Open the map
            </Link>
          </div>
          <ul className="grid gap-3">
            {(regions.data ?? []).map((region) => (
              <li key={region.slug}>
                <Link
                  to={`/regions/${region.slug}`}
                  className="postcard flex items-center justify-between gap-4 px-5 py-4 transition-transform hover:-translate-y-0.5"
                >
                  <span>
                    <span className="block font-display text-lg">{region.name}</span>
                    <span className="block text-sm text-ink-500">{region.tagline}</span>
                  </span>
                  <span aria-hidden className="text-vermilion">
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p aria-hidden className="font-display text-5xl text-vermilion/50">
          &ldquo;
        </p>
        <blockquote className="font-display text-2xl leading-snug text-ink sm:text-3xl">
          The best trip planning question isn&apos;t &ldquo;what should I see&rdquo; &mdash; it&apos;s{" "}
          <span className="text-vermilion">&ldquo;what will the weather be doing.&rdquo;</span>
        </blockquote>
        <p className="mt-4 text-sm uppercase tracking-wide text-ink-500">The StayKhoj Desk</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <NewsletterSignup />
      </section>
    </div>
  );
}
