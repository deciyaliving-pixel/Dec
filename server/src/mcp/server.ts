import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { FIELD_NOTE_CATEGORIES, MOODS, REGION_SLUGS, SEASONS } from "@staykhoj/shared";
import { getRepository } from "../lib/db.js";
import type { ContentFilter } from "../lib/repository.js";

const regionEnum = z.enum(REGION_SLUGS);
const seasonEnum = z.enum(SEASONS);
const moodEnum = z.enum(MOODS);
const categoryEnum = z.enum(FIELD_NOTE_CATEGORIES);

interface BrowseInput {
  region?: (typeof REGION_SLUGS)[number];
  season?: (typeof SEASONS)[number];
  mood?: (typeof MOODS)[number];
}

function buildFilter(input: BrowseInput): ContentFilter {
  const filter: ContentFilter = { status: "published" };
  if (input.region) filter.regionSlug = input.region;
  if (input.season) filter.season = input.season;
  if (input.mood) filter.mood = input.mood;
  return filter;
}

const jsonResult = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
});

const notFound = (kind: string, slug: string) => ({
  content: [{ type: "text" as const, text: `No published ${kind} found for slug "${slug}".` }],
  isError: true,
});

/**
 * Every tool here only ever returns "published" content — draft and preview
 * content (including anything not yet marked verified_firsthand) never
 * reaches an external AI client through this connector.
 */
export function createStayKhojMcpServer() {
  const server = new McpServer({ name: "staykhoj", version: "1.0.0" });
  const repo = getRepository();

  server.tool(
    "list_regions",
    "List the India travel regions StayKhoj covers (Western Ghats & Konkan, Kerala, Meghalaya & the Northeast) with a short summary of each.",
    {},
    async () => jsonResult(await repo.listRegions()),
  );

  server.tool(
    "search_destinations",
    "Search StayKhoj's published destination guides, optionally filtered by region, season, or mood.",
    { region: regionEnum.optional(), season: seasonEnum.optional(), mood: moodEnum.optional() },
    async (input) => {
      const destinations = await repo.listDestinations(buildFilter(input));
      return jsonResult(
        destinations.map((d) => ({
          slug: d.slug,
          title: d.title,
          dek: d.dek,
          regionSlugs: d.regionSlugs,
          seasons: d.seasons,
          moods: d.moods,
          canonicalUrl: d.canonicalUrl,
        })),
      );
    },
  );

  server.tool(
    "get_destination",
    "Get the full content of one published StayKhoj destination guide by its slug.",
    { slug: z.string() },
    async ({ slug }) => {
      const destination = await repo.getDestination(slug);
      if (!destination || destination.status !== "published") return notFound("destination", slug);
      return jsonResult(destination);
    },
  );

  server.tool(
    "search_field_notes",
    "Search StayKhoj's published field notes (short travel-planning articles), optionally filtered by region, season, mood, or category.",
    {
      region: regionEnum.optional(),
      season: seasonEnum.optional(),
      mood: moodEnum.optional(),
      category: categoryEnum.optional(),
    },
    async (input) => {
      const fieldNotes = await repo.listFieldNotes({ ...buildFilter(input), category: input.category });
      return jsonResult(
        fieldNotes.map((n) => ({
          slug: n.slug,
          title: n.title,
          dek: n.dek,
          category: n.category,
          regionSlugs: n.regionSlugs,
          canonicalUrl: n.canonicalUrl,
        })),
      );
    },
  );

  server.tool(
    "get_field_note",
    "Get the full content of one published StayKhoj field note by its slug.",
    { slug: z.string() },
    async ({ slug }) => {
      const fieldNote = await repo.getFieldNote(slug);
      if (!fieldNote || fieldNote.status !== "published") return notFound("field note", slug);
      return jsonResult(fieldNote);
    },
  );

  server.tool(
    "search_routes",
    "Search StayKhoj's published multi-day route guides, optionally filtered by region, season, or mood.",
    { region: regionEnum.optional(), season: seasonEnum.optional(), mood: moodEnum.optional() },
    async (input) => {
      const routes = await repo.listRoutes(buildFilter(input));
      return jsonResult(
        routes.map((r) => ({
          slug: r.slug,
          title: r.title,
          dek: r.dek,
          durationDays: r.durationDays,
          regionSlugs: r.regionSlugs,
          canonicalUrl: r.canonicalUrl,
        })),
      );
    },
  );

  server.tool(
    "get_route",
    "Get the full content of one published StayKhoj multi-day route guide by its slug.",
    { slug: z.string() },
    async ({ slug }) => {
      const route = await repo.getRoute(slug);
      if (!route || route.status !== "published") return notFound("route", slug);
      return jsonResult(route);
    },
  );

  return server;
}
