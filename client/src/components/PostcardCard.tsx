import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  href: string;
  image: string;
  imageAlt: string;
  kicker: string;
  title: string;
  dek: string;
  meta?: ReactNode;
  badge?: string;
}

export function PostcardCard({ href, image, imageAlt, kicker, title, dek, meta, badge }: Props) {
  return (
    <Link
      to={href}
      className="postcard group block overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-1 hover:rotate-[-0.3deg]"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-ink/10">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          className="pointer-events-none absolute bottom-2 left-2 h-10 w-10 text-paper drop-shadow"
        >
          <path
            d="M8 70 L35 45 L55 60 L92 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="6 5"
            strokeLinecap="round"
          />
          <circle cx="92" cy="20" r="5" fill="#B9451D" stroke="currentColor" strokeWidth="2" />
        </svg>
        {badge && (
          <span className="stamp absolute right-3 top-3 h-14 w-14 rotate-6 border-2 border-dashed border-ink/50 text-[0.6rem] font-semibold uppercase leading-tight">
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-2 p-5">
        <p className="kicker">{kicker}</p>
        <h3 className="text-xl font-semibold leading-snug">{title}</h3>
        <p className="text-sm text-ink-500 line-clamp-2">{dek}</p>
        {meta}
      </div>
    </Link>
  );
}
