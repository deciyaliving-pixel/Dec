import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import type { Express } from "express";

let app: Express;

beforeAll(async () => {
  // DEV_AUTH_BYPASS is read at module-load time, so force a fresh module graph
  // after setting it, rather than relying on the static import at the top of the file.
  process.env.DEV_AUTH_BYPASS = "true";
  process.env.NODE_ENV = "test";
  const { createTestApp } = await import("./app.js");
  app = createTestApp();
});

describe("studio API (dev auth bypass, editor session)", () => {
  it("reports the dev user as an editor", async () => {
    const res = await request(app).get("/api/studio/me");
    expect(res.status).toBe(200);
    expect(res.body.user?.isEditor).toBe(true);
  });

  it("lists all destinations regardless of status", async () => {
    const res = await request(app).get("/api/studio/destinations");
    expect(res.status).toBe(200);
    expect(res.body.destinations.length).toBeGreaterThan(0);
  });

  it("rejects publishing a destination that lacks verified first-hand reporting", async () => {
    const getRes = await request(app).get("/api/studio/destinations/munnar-highlands");
    const draftAttempt = {
      ...getRes.body.destination,
      reportingStatus: "planning_draft",
      status: "published",
    };
    const res = await request(app).put("/api/studio/destinations/munnar-highlands").send(draftAttempt);
    expect(res.status).toBe(400);
    expect(res.body.issues.some((i: { path: string[] }) => i.path.includes("status"))).toBe(true);
  });

  it("accepts and persists a valid edit", async () => {
    const getRes = await request(app).get("/api/studio/destinations/munnar-highlands");
    const updated = { ...getRes.body.destination, dek: "An updated dek for testing." };
    const putRes = await request(app).put("/api/studio/destinations/munnar-highlands").send(updated);
    expect(putRes.status).toBe(200);
    expect(putRes.body.destination.dek).toBe("An updated dek for testing.");

    const publicRes = await request(app).get("/api/destinations/munnar-highlands");
    expect(publicRes.body.destination.dek).toBe("An updated dek for testing.");
  });

  it("rejects a time-sensitive field note update missing a lastCheckedDate", async () => {
    const getRes = await request(app).get("/api/studio/field-notes/chasing-amboli-monsoon-waterfalls");
    const invalid = {
      ...getRes.body.fieldNote,
      hasTimeSensitiveInfo: true,
      lastCheckedDate: undefined,
    };
    const res = await request(app)
      .put("/api/studio/field-notes/chasing-amboli-monsoon-waterfalls")
      .send(invalid);
    expect(res.status).toBe(400);
  });
});
