export const REGION_SLUGS = [
  "western-ghats-konkan",
  "kerala",
  "meghalaya-northeast",
] as const;
export type RegionSlug = (typeof REGION_SLUGS)[number];

export const SEASONS = ["monsoon", "winter", "summer", "shoulder"] as const;
export type Season = (typeof SEASONS)[number];

export const MOODS = [
  "nature-adventure",
  "food-culture",
  "weekend-escape",
] as const;
export type Mood = (typeof MOODS)[number];

export const FIELD_NOTE_CATEGORIES = [
  "mountains",
  "coastlines",
  "food-trails",
  "weekend-routes",
] as const;
export type FieldNoteCategory = (typeof FIELD_NOTE_CATEGORIES)[number];

export const CONTENT_STATUSES = ["draft", "preview", "published"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

/**
 * "planning_draft" content has not been verified through first-hand travel and must
 * never carry firsthand claims (reviews, prices, visitor counts, "we visited" language).
 * Only "verified_firsthand" content is eligible for the "published" content status.
 */
export const REPORTING_STATUSES = ["planning_draft", "verified_firsthand"] as const;
export type ReportingStatus = (typeof REPORTING_STATUSES)[number];

export const CONTENT_KINDS = ["field_note", "destination", "route"] as const;
export type ContentKind = (typeof CONTENT_KINDS)[number];

export const REGION_LABELS: Record<RegionSlug, string> = {
  "western-ghats-konkan": "Western Ghats & Konkan",
  kerala: "Kerala",
  "meghalaya-northeast": "Meghalaya & the Northeast",
};

export const SEASON_LABELS: Record<Season, string> = {
  monsoon: "Monsoon",
  winter: "Winter",
  summer: "Summer",
  shoulder: "Shoulder Season",
};

export const MOOD_LABELS: Record<Mood, string> = {
  "nature-adventure": "Nature & Adventure",
  "food-culture": "Food & Culture",
  "weekend-escape": "Weekend Escape",
};

export const FIELD_NOTE_CATEGORY_LABELS: Record<FieldNoteCategory, string> = {
  mountains: "Mountains",
  coastlines: "Coastlines",
  "food-trails": "Food Trails",
  "weekend-routes": "Weekend Routes",
};
