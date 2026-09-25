import type { Request } from "express";
import { MOODS, REGION_SLUGS, SEASONS, type Mood, type RegionSlug, type Season } from "@staykhoj/shared";
import type { ContentFilter } from "./repository.js";

export function parseContentFilter(req: Request): ContentFilter {
  const region = req.query.region;
  const season = req.query.season;
  const mood = req.query.mood;

  const filter: ContentFilter = { status: "published" };
  if (typeof region === "string" && (REGION_SLUGS as readonly string[]).includes(region)) {
    filter.regionSlug = region as RegionSlug;
  }
  if (typeof season === "string" && (SEASONS as readonly string[]).includes(season)) {
    filter.season = season as Season;
  }
  if (typeof mood === "string" && (MOODS as readonly string[]).includes(mood)) {
    filter.mood = mood as Mood;
  }
  return filter;
}
