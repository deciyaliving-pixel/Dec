import type { Author, Destination, FieldNote, Region, RouteGuide } from "@staykhoj/shared";
import { seedAuthors } from "../data/seedAuthors.js";
import { seedDestinations } from "../data/seedDestinations.js";
import { seedFieldNotes } from "../data/seedFieldNotes.js";
import { seedRegions } from "../data/seedRegions.js";
import { seedRoutes } from "../data/seedRoutes.js";
import type { ContentFilter, ContentRepository } from "./repository.js";

type Editorial = { status: string; regionSlugs: string[]; seasons: string[]; moods: string[] };

function matchesFilter<T extends Editorial>(item: T, filter?: ContentFilter): boolean {
  if (!filter) return true;
  if ((filter.status ?? "published") === "published" && item.status !== "published") return false;
  if (filter.regionSlug && !item.regionSlugs.includes(filter.regionSlug)) return false;
  if (filter.season && !item.seasons.includes(filter.season)) return false;
  if (filter.mood && !item.moods.includes(filter.mood)) return false;
  return true;
}

/**
 * In-memory, seed-backed repository used when SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
 * are not configured. Intended for local development and demos only — all writes are
 * lost on restart. See README.md for how to switch to the Supabase-backed repository.
 */
export class LocalRepository implements ContentRepository {
  private regions = new Map<string, Region>(seedRegions.map((r) => [r.slug, r]));
  private authors = new Map(seedAuthors.map((a) => [a.id, a]));
  private destinations = new Map(seedDestinations.map((d) => [d.slug, d]));
  private fieldNotes = new Map(seedFieldNotes.map((f) => [f.slug, f]));
  private routes = new Map(seedRoutes.map((r) => [r.slug, r]));
  private favorites = new Map<string, Set<string>>();

  async listRegions(): Promise<Region[]> {
    return [...this.regions.values()];
  }

  async getRegion(slug: string): Promise<Region | null> {
    return this.regions.get(slug) ?? null;
  }

  async listAuthors(): Promise<Author[]> {
    return [...this.authors.values()];
  }

  async getAuthor(id: string): Promise<Author | null> {
    return this.authors.get(id) ?? null;
  }

  async listDestinations(filter?: ContentFilter): Promise<Destination[]> {
    return [...this.destinations.values()].filter((d) => matchesFilter(d, filter));
  }

  async getDestination(slug: string, opts?: { includeUnpublished?: boolean }): Promise<Destination | null> {
    const item = this.destinations.get(slug) ?? null;
    if (!item) return null;
    if (!opts?.includeUnpublished && item.status !== "published") return null;
    return item;
  }

  async upsertDestination(input: Destination): Promise<Destination> {
    this.destinations.set(input.slug, input);
    return input;
  }

  async listFieldNotes(filter?: ContentFilter & { category?: string }): Promise<FieldNote[]> {
    return [...this.fieldNotes.values()].filter(
      (f) => matchesFilter(f, filter) && (!filter?.category || f.category === filter.category),
    );
  }

  async getFieldNote(slug: string, opts?: { includeUnpublished?: boolean }): Promise<FieldNote | null> {
    const item = this.fieldNotes.get(slug) ?? null;
    if (!item) return null;
    if (!opts?.includeUnpublished && item.status !== "published") return null;
    return item;
  }

  async upsertFieldNote(input: FieldNote): Promise<FieldNote> {
    this.fieldNotes.set(input.slug, input);
    return input;
  }

  async listRoutes(filter?: ContentFilter): Promise<RouteGuide[]> {
    return [...this.routes.values()].filter((r) => matchesFilter(r, filter));
  }

  async getRoute(slug: string, opts?: { includeUnpublished?: boolean }): Promise<RouteGuide | null> {
    const item = this.routes.get(slug) ?? null;
    if (!item) return null;
    if (!opts?.includeUnpublished && item.status !== "published") return null;
    return item;
  }

  async upsertRoute(input: RouteGuide): Promise<RouteGuide> {
    this.routes.set(input.slug, input);
    return input;
  }

  async listFavorites(userId: string): Promise<string[]> {
    return [...(this.favorites.get(userId) ?? [])];
  }

  async addFavorite(userId: string, destinationSlug: string): Promise<void> {
    const set = this.favorites.get(userId) ?? new Set<string>();
    set.add(destinationSlug);
    this.favorites.set(userId, set);
  }

  async removeFavorite(userId: string, destinationSlug: string): Promise<void> {
    this.favorites.get(userId)?.delete(destinationSlug);
  }

  async addNewsletterSignup(_email: string): Promise<void> {
    // No persistence in local/dev mode — signups are only durable against Supabase.
  }

  async isEditor(_userId: string): Promise<boolean> {
    // Local/dev mode has no real auth backend; the dev-auth-bypass middleware only
    // issues a synthetic user when explicitly enabled, so treat any such user as an editor.
    return true;
  }
}
