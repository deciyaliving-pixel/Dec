import { NavLink } from "react-router-dom";

const navLinks = [
  { to: "/field-notes", label: "Field Notes" },
  { to: "/map", label: "Map" },
  { to: "/routes", label: "Routes" },
  { to: "/best-time-to-visit-india", label: "When to Go" },
  { to: "/about", label: "About" },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `border-b-2 pb-1 text-sm uppercase tracking-wide transition-colors ${
    isActive ? "border-vermilion text-ink" : "border-transparent text-ink-500 hover:text-ink hover:border-ink/30"
  }`;
}

export function Header() {
  return (
    <header className="border-b border-ink/15 bg-paper-light/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="stamp h-10 w-10 flex-shrink-0 border-2 border-dashed border-ink/40 text-lg font-display"
          >
            SK
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">StayKhoj</span>
        </NavLink>
        <nav aria-label="Primary" className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <NavLink
          to="/account"
          className="rounded-card border border-ink/30 px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-vermilion hover:text-vermilion"
        >
          Sign in
        </NavLink>
      </div>
      <nav
        aria-label="Primary mobile"
        className="flex flex-nowrap gap-4 overflow-x-auto whitespace-nowrap border-t border-ink/10 px-4 py-2 md:hidden"
      >
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={navClass}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
