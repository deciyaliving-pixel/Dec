import type {
  ContentStatus,
  FieldNoteCategory,
  Mood,
  RegionSlug,
  ReportingStatus,
  Season,
} from "./enums.js";

/**
 * Plain, hand-written data shapes used everywhere outside of validation code.
 *
 * These are intentionally NOT derived via `z.infer<...>` from the zod schemas in
 * schemas.ts. Zod's `.refine()` chains produce deeply nested `ZodEffects<ZodEffects<...>>`
 * generic types, and flowing those through an extra layer of generic instantiation
 * (a generic hook, a generic API wrapper, etc.) can silently collapse to `any` in the
 * TypeScript checker without any error — a real, reproducible compiler limitation,
 * not a mistake in the consuming code. Keeping the day-to-day types flat and hand-written
 * avoids that whole class of bug; schemas.ts's zod schemas are only used at the few
 * points that actually validate untrusted input (the Studio API).
 */

export interface ImageCredit {
  photographer: string;
  profileUrl: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatarUrl?: string;
}

export interface Region {
  slug: RegionSlug;
  name: string;
  tagline: string;
  summary: string;
  seasonalOverview: string;
  heroImage: string;
  heroImageAlt: string;
  heroImageCredit?: ImageCredit;
  metaDescription: string;
  canonicalUrl: string;
}

export interface EditorialFields {
  id: string;
  slug: string;
  title: string;
  dek: string;
  metaDescription: string;
  canonicalUrl: string;
  authorId: string;
  regionSlugs: RegionSlug[];
  seasons: Season[];
  moods: Mood[];
  heroImage: string;
  heroImageAlt: string;
  heroImageCredit?: ImageCredit;
  publishDate: string;
  hasTimeSensitiveInfo: boolean;
  lastCheckedDate?: string;
  reportingStatus: ReportingStatus;
  status: ContentStatus;
  isSeedContent: boolean;
  body: string;
  relatedDestinationSlugs: string[];
  relatedPlanningSlug?: string;
}

export interface Destination extends EditorialFields {
  lat: number;
  lng: number;
  whyGo: string;
  whoItSuits: string;
  whenToVisit: string;
  howLongToPlan: string;
  howToArrive: string;
  whatToEatNoticeAvoid: string;
  responsibleTravelNotes: string;
}

export interface FieldNote extends EditorialFields {
  category: FieldNoteCategory;
  readTimeMinutes: number;
}

export interface RouteStop {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export interface RouteGuide extends EditorialFields {
  durationDays: number;
  stops: RouteStop[];
}

export interface Favorite {
  userId: string;
  destinationSlug: string;
  createdAt: string;
}
