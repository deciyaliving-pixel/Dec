import type {
  Author,
  Destination,
  FieldNote,
  Mood,
  Region,
  RegionSlug,
  RouteGuide,
  Season,
} from "@staykhoj/shared";

export interface ContentFilter {
  status?: "published" | "all";
  regionSlug?: RegionSlug;
  season?: Season;
  mood?: Mood;
}

export interface ContentRepository {
  listRegions(): Promise<Region[]>;
  getRegion(slug: string): Promise<Region | null>;

  listAuthors(): Promise<Author[]>;
  getAuthor(id: string): Promise<Author | null>;

  listDestinations(filter?: ContentFilter): Promise<Destination[]>;
  getDestination(slug: string, opts?: { includeUnpublished?: boolean }): Promise<Destination | null>;
  upsertDestination(input: Destination): Promise<Destination>;

  listFieldNotes(filter?: ContentFilter & { category?: string }): Promise<FieldNote[]>;
  getFieldNote(slug: string, opts?: { includeUnpublished?: boolean }): Promise<FieldNote | null>;
  upsertFieldNote(input: FieldNote): Promise<FieldNote>;

  listRoutes(filter?: ContentFilter): Promise<RouteGuide[]>;
  getRoute(slug: string, opts?: { includeUnpublished?: boolean }): Promise<RouteGuide | null>;
  upsertRoute(input: RouteGuide): Promise<RouteGuide>;

  listFavorites(userId: string): Promise<string[]>;
  addFavorite(userId: string, destinationSlug: string): Promise<void>;
  removeFavorite(userId: string, destinationSlug: string): Promise<void>;

  addNewsletterSignup(email: string): Promise<void>;

  isEditor(userId: string): Promise<boolean>;
}
