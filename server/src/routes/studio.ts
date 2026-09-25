import { Router } from "express";
import { destinationSchema, fieldNoteSchema, routeGuideSchema } from "@staykhoj/shared";
import { getRepository } from "../lib/db.js";
import { requireEditor } from "../middleware/auth.js";

export const studioRouter = Router();

studioRouter.get("/me", async (req, res) => {
  if (!req.user) {
    res.json({ user: null });
    return;
  }
  const isEditor = await getRepository().isEditor(req.user.id);
  res.json({ user: { ...req.user, isEditor } });
});

studioRouter.use(requireEditor);

studioRouter.get("/destinations", async (_req, res) => {
  const destinations = await getRepository().listDestinations({ status: "all" });
  res.json({ destinations });
});

studioRouter.get("/destinations/:slug", async (req, res) => {
  const destination = await getRepository().getDestination(req.params.slug, { includeUnpublished: true });
  if (!destination) {
    res.status(404).json({ error: "Destination not found." });
    return;
  }
  res.json({ destination });
});

studioRouter.put("/destinations/:slug", async (req, res) => {
  const parsed = destinationSchema.safeParse({ ...req.body, slug: req.params.slug });
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed.", issues: parsed.error.issues });
    return;
  }
  const destination = await getRepository().upsertDestination(parsed.data);
  res.json({ destination });
});

studioRouter.get("/field-notes", async (_req, res) => {
  const fieldNotes = await getRepository().listFieldNotes({ status: "all" });
  res.json({ fieldNotes });
});

studioRouter.get("/field-notes/:slug", async (req, res) => {
  const fieldNote = await getRepository().getFieldNote(req.params.slug, { includeUnpublished: true });
  if (!fieldNote) {
    res.status(404).json({ error: "Field note not found." });
    return;
  }
  res.json({ fieldNote });
});

studioRouter.put("/field-notes/:slug", async (req, res) => {
  const parsed = fieldNoteSchema.safeParse({ ...req.body, slug: req.params.slug });
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed.", issues: parsed.error.issues });
    return;
  }
  const fieldNote = await getRepository().upsertFieldNote(parsed.data);
  res.json({ fieldNote });
});

studioRouter.get("/routes", async (_req, res) => {
  const routes = await getRepository().listRoutes({ status: "all" });
  res.json({ routes });
});

studioRouter.get("/routes/:slug", async (req, res) => {
  const route = await getRepository().getRoute(req.params.slug, { includeUnpublished: true });
  if (!route) {
    res.status(404).json({ error: "Route not found." });
    return;
  }
  res.json({ route });
});

studioRouter.put("/routes/:slug", async (req, res) => {
  const parsed = routeGuideSchema.safeParse({ ...req.body, slug: req.params.slug });
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed.", issues: parsed.error.issues });
    return;
  }
  const route = await getRepository().upsertRoute(parsed.data);
  res.json({ route });
});
