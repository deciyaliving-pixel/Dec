import type { Destination, FieldNote, RouteGuide, RouteStop } from "@staykhoj/shared";

export type StudioKind = "destinations" | "fieldNotes" | "routes";

export type StudioItem = Destination | FieldNote | RouteGuide;

export const KIND_LABELS: Record<StudioKind, string> = {
  destinations: "Destinations",
  fieldNotes: "Field Notes",
  routes: "Routes",
};

const today = new Date().toISOString().slice(0, 10);

export function blankItem(kind: StudioKind, slug: string): StudioItem {
  const base = {
    id: `${kind}-${slug}-${Date.now()}`,
    slug,
    title: "",
    dek: "",
    metaDescription: "",
    canonicalUrl: `/${kind === "fieldNotes" ? "field-notes" : kind}/${slug}`,
    authorId: "author-staykhoj-desk",
    regionSlugs: [],
    seasons: [],
    moods: [],
    heroImage: "",
    heroImageAlt: "",
    publishDate: today,
    hasTimeSensitiveInfo: false,
    lastCheckedDate: undefined,
    reportingStatus: "planning_draft" as const,
    status: "draft" as const,
    isSeedContent: false,
    body: "",
    relatedDestinationSlugs: [],
    relatedPlanningSlug: "/best-time-to-visit-india",
  };

  if (kind === "destinations") {
    return {
      ...base,
      lat: 0,
      lng: 0,
      whyGo: "",
      whoItSuits: "",
      whenToVisit: "",
      howLongToPlan: "",
      howToArrive: "",
      whatToEatNoticeAvoid: "",
      responsibleTravelNotes: "",
    } as Destination;
  }
  if (kind === "fieldNotes") {
    return { ...base, category: "weekend-routes", readTimeMinutes: 1 } as FieldNote;
  }
  const defaultStop: RouteStop = { name: "", lat: 0, lng: 0, description: "" };
  return { ...base, durationDays: 1, stops: [defaultStop] } as RouteGuide;
}
