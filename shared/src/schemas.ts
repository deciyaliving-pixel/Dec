import { z } from "zod";
import {
  CONTENT_STATUSES,
  FIELD_NOTE_CATEGORIES,
  MOODS,
  REGION_SLUGS,
  REPORTING_STATUSES,
  SEASONS,
} from "./enums.js";

const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase, hyphenated slug");

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be an ISO date (YYYY-MM-DD)");

export const authorSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  bio: z.string().min(1),
  avatarUrl: z.string().url().optional(),
});

/**
 * Fields every editorial content type (field note, destination guide, route) shares.
 * Encodes the non-negotiable editorial rules from the content policy:
 *  - time-sensitive info must show a "last checked" date
 *  - content without verified first-hand reporting can never reach "published"
 */
const editorialBaseSchema = z.object({
  id: z.string(),
  slug,
  title: z.string().min(1),
  metaDescription: z.string().min(1).max(160),
  canonicalUrl: z.string().min(1),
  authorId: z.string(),
  regionSlugs: z.array(z.enum(REGION_SLUGS)).min(1),
  seasons: z.array(z.enum(SEASONS)).min(1),
  moods: z.array(z.enum(MOODS)).min(1),
  heroImage: z.string().min(1),
  heroImageAlt: z.string().min(1),
  /** Only set for hotlinked stock photography (seed content); omitted for Studio-uploaded images. */
  heroImageCredit: z
    .object({ photographer: z.string().min(1), profileUrl: z.string().url() })
    .optional(),
  publishDate: isoDate,
  hasTimeSensitiveInfo: z.boolean().default(false),
  lastCheckedDate: isoDate.optional(),
  reportingStatus: z.enum(REPORTING_STATUSES),
  status: z.enum(CONTENT_STATUSES),
  isSeedContent: z.boolean().default(false),
});

function withEditorialRules<T extends z.ZodTypeAny>(schema: T) {
  return schema
    .refine((v) => !v.hasTimeSensitiveInfo || Boolean(v.lastCheckedDate), {
      message: "Time-sensitive content must include a lastCheckedDate.",
      path: ["lastCheckedDate"],
    })
    .refine((v) => v.status !== "published" || v.reportingStatus === "verified_firsthand", {
      message:
        'Content cannot be published until it carries verified first-hand reporting. It must stay a "Planning draft — pending verification".',
      path: ["status"],
    });
}

export const destinationSchema = withEditorialRules(
  editorialBaseSchema.extend({
    dek: z.string().min(1),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    whyGo: z.string().min(1),
    whoItSuits: z.string().min(1),
    whenToVisit: z.string().min(1),
    howLongToPlan: z.string().min(1),
    howToArrive: z.string().min(1),
    whatToEatNoticeAvoid: z.string().min(1),
    responsibleTravelNotes: z.string().min(1),
    body: z.string().min(1),
    relatedDestinationSlugs: z.array(slug).max(4).default([]),
    relatedPlanningSlug: z.string().optional(),
  }),
);

export const fieldNoteSchema = withEditorialRules(
  editorialBaseSchema.extend({
    dek: z.string().min(1),
    category: z.enum(FIELD_NOTE_CATEGORIES),
    body: z.string().min(1),
    readTimeMinutes: z.number().int().positive(),
    relatedDestinationSlugs: z.array(slug).max(6).default([]),
    relatedPlanningSlug: z.string().optional(),
  }),
);

export const routeStopSchema = z.object({
  name: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  description: z.string().min(1),
});

export const routeGuideSchema = withEditorialRules(
  editorialBaseSchema.extend({
    dek: z.string().min(1),
    durationDays: z.number().int().positive(),
    stops: z.array(routeStopSchema).min(2),
    body: z.string().min(1),
    relatedDestinationSlugs: z.array(slug).max(6).default([]),
    relatedPlanningSlug: z.string().optional(),
  }),
);

export const regionSchema = z.object({
  slug: z.enum(REGION_SLUGS),
  name: z.string().min(1),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  seasonalOverview: z.string().min(1),
  heroImage: z.string().min(1),
  heroImageAlt: z.string().min(1),
  heroImageCredit: z
    .object({ photographer: z.string().min(1), profileUrl: z.string().url() })
    .optional(),
  metaDescription: z.string().min(1).max(160),
  canonicalUrl: z.string().min(1),
});

export const favoriteSchema = z.object({
  userId: z.string(),
  destinationSlug: slug,
  createdAt: z.string(),
});

export const newsletterSignupSchema = z.object({
  email: z.string().email(),
});

export const editorialStatusMessage = (reportingStatus: string) =>
  reportingStatus === "verified_firsthand"
    ? null
    : "Planning draft — pending verification";
