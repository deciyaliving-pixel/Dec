import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { FIELD_NOTE_CATEGORIES, MOODS, REGION_SLUGS, SEASONS, fieldNoteSchema } from "@staykhoj/shared";
import { getRepository } from "../lib/db.js";
import type { ContentFilter } from "../lib/repository.js";
import { MCP_ADMIN_TOKEN } from "../lib/env.js";

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
 * Every read tool here only ever returns "published" content — draft and
 * preview content (including anything not yet marked verified_firsthand)
 * never reaches an external AI client through this connector. The one write
 * tool (create_field_note_draft) is gated behind MCP_ADMIN_TOKEN and can
 * only ever create a draft, never publish.
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

  server.tool(
    "create_field_note_draft",
    "Create a new StayKhoj field note as an editor draft, for a human to review and publish in Studio. " +
      "Requires an admin token (ask the person you're talking to for it — it's a StayKhoj site secret, " +
      "never something to guess or reuse from elsewhere). Always lands as status=draft with " +
      "reportingStatus=planning_draft — this tool can never publish content directly, by design.",
    {
      adminToken: z.string().describe("The StayKhoj MCP admin token."),
      slug: z.string().describe("Lowercase, hyphenated URL slug, e.g. 'monsoon-trekking-in-wayanad'."),
      title: z.string(),
      dek: z.string().describe("One-sentence standfirst shown under the title."),
      category: categoryEnum,
      regionSlugs: z.array(regionEnum).min(1),
      seasons: z.array(seasonEnum).min(1),
      moods: z.array(moodEnum).min(1),
      body: z.string().describe("Article body. Write it as forward-looking planning research, not a firsthand account."),
      heroImage: z.string().url(),
      heroImageAlt: z.string(),
      metaDescription: z.string().max(160),
      authorId: z.string().optional().describe("Defaults to the 'author-staykhoj-desk' editorial byline."),
      publishDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional()
        .describe("ISO date (YYYY-MM-DD). Defaults to today."),
    },
    async (input) => {
      if (!MCP_ADMIN_TOKEN || input.adminToken !== MCP_ADMIN_TOKEN) {
        return {
          content: [{ type: "text", text: "Invalid or missing admin token. This tool is not usable without it." }],
          isError: true,
        };
      }

      const wordCount = input.body.trim().split(/\s+/).filter(Boolean).length;
      const candidate = {
        id: `fn-${input.slug}`,
        slug: input.slug,
        title: input.title,
        dek: input.dek,
        category: input.category,
        regionSlugs: input.regionSlugs,
        seasons: input.seasons,
        moods: input.moods,
        body: input.body,
        readTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
        heroImage: input.heroImage,
        heroImageAlt: input.heroImageAlt,
        metaDescription: input.metaDescription,
        canonicalUrl: `/field-notes/${input.slug}`,
        authorId: input.authorId ?? "author-staykhoj-desk",
        publishDate: input.publishDate ?? new Date().toISOString().slice(0, 10),
        hasTimeSensitiveInfo: false,
        // Forced regardless of what a caller passes: this connector can only
        // ever create drafts pending verification, never publish directly.
        reportingStatus: "planning_draft" as const,
        status: "draft" as const,
        isSeedContent: false,
        relatedDestinationSlugs: [],
      };

      const parsed = fieldNoteSchema.safeParse(candidate);
      if (!parsed.success) {
        return {
          content: [{ type: "text", text: `Validation failed: ${JSON.stringify(parsed.error.issues, null, 2)}` }],
          isError: true,
        };
      }

      const saved = await repo.upsertFieldNote(parsed.data);
      return jsonResult({
        message: `Created draft field note "${saved.title}". It will not appear on the site until an editor reviews it in Studio and publishes it.`,
        slug: saved.slug,
        status: saved.status,
        reportingStatus: saved.reportingStatus,
      });
    },
  );

  return server;
}
