import { formatDateShort } from "../lib/format";

interface Props {
  place?: string;
  publishDate?: string;
  readTimeMinutes?: number;
  authorName?: string;
}

export function MetaStrip({ place, publishDate, readTimeMinutes, authorName }: Props) {
  const parts = [place, authorName, publishDate && formatDateShort(publishDate), readTimeMinutes && `${readTimeMinutes} min read`].filter(
    Boolean,
  );

  return (
    <p className="field-note-meta">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-3">
          {i > 0 && <span aria-hidden className="text-vermilion">&middot;</span>}
          {part}
        </span>
      ))}
    </p>
  );
}
