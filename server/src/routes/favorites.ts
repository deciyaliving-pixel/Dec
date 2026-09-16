import { Router } from "express";
import { getRepository } from "../lib/db.js";
import { requireAuth } from "../middleware/auth.js";

export const favoritesRouter = Router();

favoritesRouter.use(requireAuth);

favoritesRouter.get("/", async (req, res) => {
  const favorites = await getRepository().listFavorites(req.user!.id);
  res.json({ favorites });
});

favoritesRouter.post("/", async (req, res) => {
  const destinationSlug = req.body?.destinationSlug;
  if (typeof destinationSlug !== "string" || !destinationSlug) {
    res.status(400).json({ error: "destinationSlug is required." });
    return;
  }
  await getRepository().addFavorite(req.user!.id, destinationSlug);
  res.status(201).json({ ok: true });
});

favoritesRouter.delete("/:destinationSlug", async (req, res) => {
  await getRepository().removeFavorite(req.user!.id, req.params.destinationSlug);
  res.json({ ok: true });
});
