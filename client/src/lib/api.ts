import type { Author, Destination, FieldNote, Mood, Region, RegionSlug, RouteGuide, Season } from "@staykhoj/shared";
import { supabase } from "./supabaseClient";

export interface ContentFilterParams {
  region?: RegionSlug;
  season?: Season;
  mood?: Mood;
  category?: string;
}

async function authHeaders(): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function toQuery(params?: ContentFilterParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  if (params.region) search.set("region", params.region);
  if (params.season) search.set("season", params.season);
  if (params.mood) search.set("mood", params.mood);
  if (params.category) search.set("category", params.category);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function getJson<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(path, opts);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request to ${path} failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function listRegions(): Promise<Region[]> {
  const res = await getJson<{ regions: Region[] }>("/api/regions");
  return res.regions;
}

async function getRegion(slug: string): Promise<Region> {
  const res = await getJson<{ region: Region }>(`/api/regions/${slug}`);
  return res.region;
}

async function listDestinations(filter?: ContentFilterParams): Promise<Destination[]> {
  const res = await getJson<{ destinations: Destination[] }>(`/api/destinations${toQuery(filter)}`);
  return res.destinations;
}

async function getDestination(slug: string): Promise<{ destination: Destination; author?: Author }> {
  return getJson(`/api/destinations/${slug}`);
}

async function listFieldNotes(filter?: ContentFilterParams): Promise<FieldNote[]> {
  const res = await getJson<{ fieldNotes: FieldNote[] }>(`/api/field-notes${toQuery(filter)}`);
  return res.fieldNotes;
}

async function getFieldNote(slug: string): Promise<{ fieldNote: FieldNote; author?: Author }> {
  return getJson(`/api/field-notes/${slug}`);
}

async function listRoutes(filter?: ContentFilterParams): Promise<RouteGuide[]> {
  const res = await getJson<{ routes: RouteGuide[] }>(`/api/routes${toQuery(filter)}`);
  return res.routes;
}

async function getRoute(slug: string): Promise<{ route: RouteGuide; author?: Author }> {
  return getJson(`/api/routes/${slug}`);
}

async function signUpForNewsletter(email: string): Promise<{ ok: boolean }> {
  return getJson("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

async function listFavorites(): Promise<string[]> {
  const headers = await authHeaders();
  const res = await getJson<{ favorites: string[] }>("/api/favorites", { headers });
  return res.favorites;
}

async function addFavorite(destinationSlug: string): Promise<{ ok: boolean }> {
  const headers = await authHeaders();
  return getJson("/api/favorites", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ destinationSlug }),
  });
}

async function removeFavorite(destinationSlug: string): Promise<{ ok: boolean }> {
  const headers = await authHeaders();
  return getJson(`/api/favorites/${destinationSlug}`, { method: "DELETE", headers });
}

export interface StudioUser {
  id: string;
  email?: string;
  isEditor: boolean;
}

async function studioMe(): Promise<{ user: StudioUser | null }> {
  const headers = await authHeaders();
  return getJson("/api/studio/me", { headers });
}

async function studioListDestinations(): Promise<Destination[]> {
  const headers = await authHeaders();
  const res = await getJson<{ destinations: Destination[] }>("/api/studio/destinations", { headers });
  return res.destinations;
}

async function studioGetDestination(slug: string): Promise<Destination> {
  const headers = await authHeaders();
  const res = await getJson<{ destination: Destination }>(`/api/studio/destinations/${slug}`, { headers });
  return res.destination;
}

async function studioPutDestination(slug: string, input: Destination): Promise<{ destination: Destination }> {
  const headers = await authHeaders();
  return getJson(`/api/studio/destinations/${slug}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

async function studioListFieldNotes(): Promise<FieldNote[]> {
  const headers = await authHeaders();
  const res = await getJson<{ fieldNotes: FieldNote[] }>("/api/studio/field-notes", { headers });
  return res.fieldNotes;
}

async function studioGetFieldNote(slug: string): Promise<FieldNote> {
  const headers = await authHeaders();
  const res = await getJson<{ fieldNote: FieldNote }>(`/api/studio/field-notes/${slug}`, { headers });
  return res.fieldNote;
}

async function studioPutFieldNote(slug: string, input: FieldNote): Promise<{ fieldNote: FieldNote }> {
  const headers = await authHeaders();
  return getJson(`/api/studio/field-notes/${slug}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

async function studioListRoutes(): Promise<RouteGuide[]> {
  const headers = await authHeaders();
  const res = await getJson<{ routes: RouteGuide[] }>("/api/studio/routes", { headers });
  return res.routes;
}

async function studioGetRoute(slug: string): Promise<RouteGuide> {
  const headers = await authHeaders();
  const res = await getJson<{ route: RouteGuide }>(`/api/studio/routes/${slug}`, { headers });
  return res.route;
}

async function studioPutRoute(slug: string, input: RouteGuide): Promise<{ route: RouteGuide }> {
  const headers = await authHeaders();
  return getJson(`/api/studio/routes/${slug}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export const api = {
  regions: { list: listRegions, get: getRegion },
  destinations: { list: listDestinations, get: getDestination },
  fieldNotes: { list: listFieldNotes, get: getFieldNote },
  routes: { list: listRoutes, get: getRoute },
  newsletter: { signUp: signUpForNewsletter },
  favorites: { list: listFavorites, add: addFavorite, remove: removeFavorite },
  studio: {
    me: studioMe,
    destinations: { list: studioListDestinations, get: studioGetDestination, put: studioPutDestination },
    fieldNotes: { list: studioListFieldNotes, get: studioGetFieldNote, put: studioPutFieldNote },
    routes: { list: studioListRoutes, get: studioGetRoute, put: studioPutRoute },
  },
};
