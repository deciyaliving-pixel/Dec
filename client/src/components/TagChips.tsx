export function TagChips({ labels, tone = "ink" }: { labels: string[]; tone?: "ink" | "vermilion" }) {
  if (!labels.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {labels.map((label) => (
        <li
          key={label}
          className={`rounded-full border px-2.5 py-0.5 text-xs uppercase tracking-wide ${
            tone === "vermilion" ? "border-vermilion/40 text-vermilion" : "border-ink/25 text-ink-500"
          }`}
        >
          {label}
        </li>
      ))}
    </ul>
  );
}
