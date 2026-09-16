import { useDocumentMeta } from "../hooks/useDocumentMeta";

export function AboutPage() {
  useDocumentMeta({
    title: "About — StayKhoj",
    description: "StayKhoj is an India travel journal built around field notes, seasonal planning, and honest reporting.",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="kicker">About</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">A travel journal, not a listicle factory</h1>
      <div className="prose-body mt-8 space-y-5 text-[1.05rem] leading-relaxed text-ink-700">
        <p>
          StayKhoj started from a simple frustration: most India travel content answers &ldquo;what to see&rdquo;
          and almost none of it answers &ldquo;when should I actually go, and what changes if I don&apos;t.&rdquo;
          Monsoon timing, permit rules, tide-dependent boat crossings, once-a-decade flowering events &mdash; the
          details that make or break a trip rarely make it into a listicle.
        </p>
        <p>
          So StayKhoj is built as a journal first: field notes written from specific trips, regional hubs that
          connect the dots between destinations, and one flagship seasonal guide tying the whole country together
          by month rather than by monument.
        </p>
        <p>
          Every piece of content here carries an editorial status. Field notes and destination guides written from
          verified, first-hand reporting are marked as such. Anything still in desk research &mdash; gathered from
          public sources ahead of an on-ground visit &mdash; is labelled a &ldquo;Planning draft&rdquo; and is never
          presented as if someone from StayKhoj has already been there. Time-sensitive details like transport,
          pricing, or permit rules carry a &ldquo;last checked&rdquo; date rather than being stated as permanent
          fact.
        </p>
        <p>
          The name is a mix of &ldquo;stay&rdquo; and khoj, Hindi for search or discovery &mdash; the two halves of
          deciding where to go next.
        </p>
      </div>
    </div>
  );
}
