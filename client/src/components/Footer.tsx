import { Link } from "react-router-dom";
import { REGION_LABELS, REGION_SLUGS } from "@staykhoj/shared";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/15 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold">StayKhoj</p>
            <p className="mt-2 max-w-xs text-sm text-paper/70">
              An India travel journal for deciding where to go, when to go, and how to travel a little more
              thoughtfully.
            </p>
          </div>
          <div>
            <p className="kicker mb-3 text-paper/60">Regions</p>
            <ul className="space-y-2 text-sm">
              {REGION_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link to={`/regions/${slug}`} className="text-paper/80 hover:text-paper">
                    {REGION_LABELS[slug]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kicker mb-3 text-paper/60">Plan</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/best-time-to-visit-india" className="text-paper/80 hover:text-paper">
                  Best Time to Visit India
                </Link>
              </li>
              <li>
                <Link to="/routes" className="text-paper/80 hover:text-paper">
                  Route Guides
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-paper/80 hover:text-paper">
                  Destination Map
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-paper/80 hover:text-paper">
                  About StayKhoj
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-paper/15 pt-6 text-xs text-paper/50">
          &copy; {new Date().getFullYear()} StayKhoj. Field notes marked &ldquo;Planning draft&rdquo; are desk
          research pending on-ground verification and are not published on the public site.
        </p>
      </div>
    </footer>
  );
}
