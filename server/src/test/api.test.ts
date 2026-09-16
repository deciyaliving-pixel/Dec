import { describe, expect, it } from "vitest";
import request from "supertest";
import { createTestApp } from "./app.js";

const app = createTestApp();

describe("public content API", () => {
  it("lists all seeded regions", async () => {
    const res = await request(app).get("/api/regions");
    expect(res.status).toBe(200);
    expect(res.body.regions).toHaveLength(3);
    expect(res.body.regions.map((r: { slug: string }) => r.slug)).toContain("kerala");
  });

  it("404s for an unknown region", async () => {
    const res = await request(app).get("/api/regions/atlantis");
    expect(res.status).toBe(404);
  });

  it("lists only published destinations", async () => {
    const res = await request(app).get("/api/destinations");
    expect(res.status).toBe(200);
    expect(res.body.destinations.length).toBeGreaterThan(0);
    for (const d of res.body.destinations) {
      expect(d.status).toBe("published");
    }
  });

  it("filters destinations by region", async () => {
    const res = await request(app).get("/api/destinations?region=kerala");
    expect(res.status).toBe(200);
    for (const d of res.body.destinations) {
      expect(d.regionSlugs).toContain("kerala");
    }
  });

  it("returns a destination with its author", async () => {
    const res = await request(app).get("/api/destinations/munnar-highlands");
    expect(res.status).toBe(200);
    expect(res.body.destination.title).toBe("Munnar Highlands");
    expect(res.body.author?.name).toBeTruthy();
  });

  it("404s for an unpublished or unknown destination slug", async () => {
    const res = await request(app).get("/api/destinations/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("never exposes the seeded planning-draft field note publicly", async () => {
    const list = await request(app).get("/api/field-notes");
    const slugs = list.body.fieldNotes.map((f: { slug: string }) => f.slug);
    expect(slugs).not.toContain("cherrapunji-peak-monsoon-planning-draft");

    const direct = await request(app).get("/api/field-notes/cherrapunji-peak-monsoon-planning-draft");
    expect(direct.status).toBe(404);
  });

  it("filters field notes by category", async () => {
    const res = await request(app).get("/api/field-notes?category=food-trails");
    expect(res.status).toBe(200);
    for (const note of res.body.fieldNotes) {
      expect(note.category).toBe("food-trails");
    }
  });

  it("lists published route guides with their stops", async () => {
    const res = await request(app).get("/api/routes");
    expect(res.status).toBe(200);
    expect(res.body.routes.length).toBeGreaterThan(0);
    expect(res.body.routes[0].stops.length).toBeGreaterThanOrEqual(2);
  });
});

describe("newsletter signup", () => {
  it("accepts a valid email", async () => {
    const res = await request(app).post("/api/newsletter").send({ email: "reader@example.com" });
    expect(res.status).toBe(201);
  });

  it("rejects an invalid email", async () => {
    const res = await request(app).post("/api/newsletter").send({ email: "not-an-email" });
    expect(res.status).toBe(400);
  });
});

describe("auth-gated routes without a session", () => {
  it("rejects favorites list without auth", async () => {
    const res = await request(app).get("/api/favorites");
    expect(res.status).toBe(401);
  });

  it("reports no user on /api/studio/me", async () => {
    const res = await request(app).get("/api/studio/me");
    expect(res.status).toBe(200);
    expect(res.body.user).toBeNull();
  });

  it("rejects studio writes without auth", async () => {
    const res = await request(app).put("/api/studio/destinations/munnar-highlands").send({});
    expect(res.status).toBe(401);
  });
});
