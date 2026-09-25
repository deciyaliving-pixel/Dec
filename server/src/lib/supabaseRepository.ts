import type { Author, Destination, FieldNote, Region, RouteGuide } from "@staykhoj/shared";
import { getSupabaseAdmin } from "./supabaseClient.js";
import type { ContentFilter, ContentRepository } from "./repository.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
function toCamelBase(row: any) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    dek: row.dek,
    regionSlugs: row.region_slugs,
    seasons: row.seasons,
    moods: row.moods,
    heroImage: row.hero_image,
    heroImageAlt: row.hero_image_alt,
    heroImageCredit: row.hero_image_credit ?? undefined,
    metaDescription: row.meta_description,
    canonicalUrl: row.canonical_url,
    authorId: row.author_id,
    publishDate: row.publish_date,
    hasTimeSensitiveInfo: row.has_time_sensitive_info,
    lastCheckedDate: row.last_checked_date ?? undefined,
    reportingStatus: row.reporting_status,
    status: row.status,
    isSeedContent: row.is_seed_content,
    body: row.body,
    relatedDestinationSlugs: row.related_destination_slugs ?? [],
    relatedPlanningSlug: row.related_planning_slug ?? undefined,
  };
}

function rowToDestination(row: any): Destination {
  return {
    ...toCamelBase(row),
    lat: row.lat,
    lng: row.lng,
    whyGo: row.why_go,
    whoItSuits: row.who_it_suits,
    whenToVisit: row.when_to_visit,
    howLongToPlan: row.how_long_to_plan,
    howToArrive: row.how_to_arrive,
    whatToEatNoticeAvoid: row.what_to_eat_notice_avoid,
    responsibleTravelNotes: row.responsible_travel_notes,
  };
}

function destinationToRow(input: Destination) {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    dek: input.dek,
    region_slugs: input.regionSlugs,
    seasons: input.seasons,
    moods: input.moods,
    lat: input.lat,
    lng: input.lng,
    why_go: input.whyGo,
    who_it_suits: input.whoItSuits,
    when_to_visit: input.whenToVisit,
    how_long_to_plan: input.howLongToPlan,
    how_to_arrive: input.howToArrive,
    what_to_eat_notice_avoid: input.whatToEatNoticeAvoid,
    responsible_travel_notes: input.responsibleTravelNotes,
    body: input.body,
    hero_image: input.heroImage,
    hero_image_alt: input.heroImageAlt,
    hero_image_credit: input.heroImageCredit ?? null,
    meta_description: input.metaDescription,
    canonical_url: input.canonicalUrl,
    author_id: input.authorId,
    publish_date: input.publishDate,
    has_time_sensitive_info: input.hasTimeSensitiveInfo,
    last_checked_date: input.lastCheckedDate ?? null,
    reporting_status: input.reportingStatus,
    status: input.status,
    is_seed_content: input.isSeedContent,
    related_destination_slugs: input.relatedDestinationSlugs,
    related_planning_slug: input.relatedPlanningSlug ?? null,
  };
}

function rowToFieldNote(row: any): FieldNote {
  return {
    ...toCamelBase(row),
    category: row.category,
    readTimeMinutes: row.read_time_minutes,
  };
}

function fieldNoteToRow(input: FieldNote) {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    dek: input.dek,
    category: input.category,
    region_slugs: input.regionSlugs,
    seasons: input.seasons,
    moods: input.moods,
    body: input.body,
    read_time_minutes: input.readTimeMinutes,
    hero_image: input.heroImage,
    hero_image_alt: input.heroImageAlt,
    hero_image_credit: input.heroImageCredit ?? null,
    meta_description: input.metaDescription,
    canonical_url: input.canonicalUrl,
    author_id: input.authorId,
    publish_date: input.publishDate,
    has_time_sensitive_info: input.hasTimeSensitiveInfo,
    last_checked_date: input.lastCheckedDate ?? null,
    reporting_status: input.reportingStatus,
    status: input.status,
    is_seed_content: input.isSeedContent,
    related_destination_slugs: input.relatedDestinationSlugs,
    related_planning_slug: input.relatedPlanningSlug ?? null,
  };
}

function rowToRoute(row: any): RouteGuide {
  return {
    ...toCamelBase(row),
    durationDays: row.duration_days,
    stops: row.stops,
  };
}

function routeToRow(input: RouteGuide) {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    dek: input.dek,
    region_slugs: input.regionSlugs,
    seasons: input.seasons,
    moods: input.moods,
    duration_days: input.durationDays,
    stops: input.stops,
    body: input.body,
    hero_image: input.heroImage,
    hero_image_alt: input.heroImageAlt,
    hero_image_credit: input.heroImageCredit ?? null,
    meta_description: input.metaDescription,
    canonical_url: input.canonicalUrl,
    author_id: input.authorId,
    publish_date: input.publishDate,
    has_time_sensitive_info: input.hasTimeSensitiveInfo,
    last_checked_date: input.lastCheckedDate ?? null,
    reporting_status: input.reportingStatus,
    status: input.status,
    is_seed_content: input.isSeedContent,
    related_destination_slugs: input.relatedDestinationSlugs,
    related_planning_slug: input.relatedPlanningSlug ?? null,
  };
}

function rowToRegion(row: any): Region {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    summary: row.summary,
    seasonalOverview: row.seasonal_overview,
    heroImage: row.hero_image,
    heroImageAlt: row.hero_image_alt,
    heroImageCredit: row.hero_image_credit ?? undefined,
    metaDescription: row.meta_description,
    canonicalUrl: row.canonical_url,
  };
}

function rowToAuthor(row: any): Author {
  return { id: row.id, name: row.name, bio: row.bio, avatarUrl: row.avatar_url ?? undefined };
}

function applyFilter(query: any, filter?: ContentFilter) {
  if ((filter?.status ?? "published") === "published") {
    query = query.eq("status", "published");
  }
  if (filter?.regionSlug) query = query.contains("region_slugs", [filter.regionSlug]);
  if (filter?.season) query = query.contains("seasons", [filter.season]);
  if (filter?.mood) query = query.contains("moods", [filter.mood]);
  return query;
}

/** Production repository backed by a real Supabase Postgres project. */
export class SupabaseRepository implements ContentRepository {
  private get db() {
    return getSupabaseAdmin();
  }

  async listRegions(): Promise<Region[]> {
    const { data, error } = await this.db.from("regions").select("*");
    if (error) throw error;
    return (data ?? []).map(rowToRegion);
  }

  async getRegion(slug: string): Promise<Region | null> {
    const { data, error } = await this.db.from("regions").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data ? rowToRegion(data) : null;
  }

  async listAuthors(): Promise<Author[]> {
    const { data, error } = await this.db.from("authors").select("*");
    if (error) throw error;
    return (data ?? []).map(rowToAuthor);
  }

  async getAuthor(id: string): Promise<Author | null> {
    const { data, error } = await this.db.from("authors").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? rowToAuthor(data) : null;
  }

  async listDestinations(filter?: ContentFilter): Promise<Destination[]> {
    const { data, error } = await applyFilter(this.db.from("destinations").select("*"), filter);
    if (error) throw error;
    return (data ?? []).map(rowToDestination);
  }

  async getDestination(slug: string, opts?: { includeUnpublished?: boolean }): Promise<Destination | null> {
    let query = this.db.from("destinations").select("*").eq("slug", slug);
    if (!opts?.includeUnpublished) query = query.eq("status", "published");
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data ? rowToDestination(data) : null;
  }

  async upsertDestination(input: Destination): Promise<Destination> {
    const { data, error } = await this.db
      .from("destinations")
      .upsert(destinationToRow(input), { onConflict: "slug" })
      .select("*")
      .single();
    if (error) throw error;
    return rowToDestination(data);
  }

  async listFieldNotes(filter?: ContentFilter & { category?: string }): Promise<FieldNote[]> {
    let query = applyFilter(this.db.from("field_notes").select("*"), filter);
    if (filter?.category) query = query.eq("category", filter.category);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(rowToFieldNote);
  }

  async getFieldNote(slug: string, opts?: { includeUnpublished?: boolean }): Promise<FieldNote | null> {
    let query = this.db.from("field_notes").select("*").eq("slug", slug);
    if (!opts?.includeUnpublished) query = query.eq("status", "published");
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data ? rowToFieldNote(data) : null;
  }

  async upsertFieldNote(input: FieldNote): Promise<FieldNote> {
    const { data, error } = await this.db
      .from("field_notes")
      .upsert(fieldNoteToRow(input), { onConflict: "slug" })
      .select("*")
      .single();
    if (error) throw error;
    return rowToFieldNote(data);
  }

  async listRoutes(filter?: ContentFilter): Promise<RouteGuide[]> {
    const { data, error } = await applyFilter(this.db.from("routes").select("*"), filter);
    if (error) throw error;
    return (data ?? []).map(rowToRoute);
  }

  async getRoute(slug: string, opts?: { includeUnpublished?: boolean }): Promise<RouteGuide | null> {
    let query = this.db.from("routes").select("*").eq("slug", slug);
    if (!opts?.includeUnpublished) query = query.eq("status", "published");
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data ? rowToRoute(data) : null;
  }

  async upsertRoute(input: RouteGuide): Promise<RouteGuide> {
    const { data, error } = await this.db
      .from("routes")
      .upsert(routeToRow(input), { onConflict: "slug" })
      .select("*")
      .single();
    if (error) throw error;
    return rowToRoute(data);
  }

  async listFavorites(userId: string): Promise<string[]> {
    const { data, error } = await this.db.from("favorites").select("destination_slug").eq("user_id", userId);
    if (error) throw error;
    return (data ?? []).map((r: any) => r.destination_slug);
  }

  async addFavorite(userId: string, destinationSlug: string): Promise<void> {
    const { error } = await this.db
      .from("favorites")
      .upsert({ user_id: userId, destination_slug: destinationSlug }, { onConflict: "user_id,destination_slug" });
    if (error) throw error;
  }

  async removeFavorite(userId: string, destinationSlug: string): Promise<void> {
    const { error } = await this.db
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("destination_slug", destinationSlug);
    if (error) throw error;
  }

  async addNewsletterSignup(email: string): Promise<void> {
    const { error } = await this.db.from("newsletter_signups").upsert({ email });
    if (error) throw error;
  }

  async isEditor(userId: string): Promise<boolean> {
    const { data, error } = await this.db.from("profiles").select("is_editor").eq("id", userId).maybeSingle();
    if (error) throw error;
    return Boolean(data?.is_editor);
  }
}
