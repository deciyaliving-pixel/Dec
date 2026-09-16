import { describe, expect, it } from "vitest";
import { destinationSchema } from "./schemas.js";

const baseDestination = {
  id: "dest-1",
  slug: "test-destination",
  title: "Test Destination",
  dek: "A test destination.",
  metaDescription: "A test destination for unit tests.",
  canonicalUrl: "/regions/kerala/destinations/test-destination",
  authorId: "author-1",
  regionSlugs: ["kerala"],
  seasons: ["winter"],
  moods: ["nature-adventure"],
  heroImage: "/images/test.jpg",
  heroImageAlt: "A test image",
  publishDate: "2026-01-01",
  hasTimeSensitiveInfo: false,
  reportingStatus: "verified_firsthand",
  status: "published",
  isSeedContent: true,
  lat: 10,
  lng: 76,
  whyGo: "Because it's a test.",
  whoItSuits: "Testers.",
  whenToVisit: "Anytime.",
  howLongToPlan: "A day.",
  howToArrive: "By test runner.",
  whatToEatNoticeAvoid: "Nothing in particular.",
  responsibleTravelNotes: "Be kind to the test suite.",
  body: "This is the body of a test destination.",
};

describe("destinationSchema editorial rules", () => {
  it("accepts a fully valid, published, verified destination", () => {
    const result = destinationSchema.safeParse(baseDestination);
    expect(result.success).toBe(true);
  });

  it("rejects publishing content without verified first-hand reporting", () => {
    const result = destinationSchema.safeParse({
      ...baseDestination,
      status: "published",
      reportingStatus: "planning_draft",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("status"))).toBe(true);
    }
  });

  it("allows planning-draft content to stay in draft or preview", () => {
    const draft = destinationSchema.safeParse({
      ...baseDestination,
      status: "draft",
      reportingStatus: "planning_draft",
    });
    expect(draft.success).toBe(true);

    const preview = destinationSchema.safeParse({
      ...baseDestination,
      status: "preview",
      reportingStatus: "planning_draft",
    });
    expect(preview.success).toBe(true);
  });

  it("rejects time-sensitive content missing a lastCheckedDate", () => {
    const result = destinationSchema.safeParse({
      ...baseDestination,
      hasTimeSensitiveInfo: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("lastCheckedDate"))).toBe(true);
    }
  });

  it("accepts time-sensitive content that includes a lastCheckedDate", () => {
    const result = destinationSchema.safeParse({
      ...baseDestination,
      hasTimeSensitiveInfo: true,
      lastCheckedDate: "2026-06-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid region slug", () => {
    const result = destinationSchema.safeParse({
      ...baseDestination,
      regionSlugs: ["atlantis"],
    });
    expect(result.success).toBe(false);
  });
});
