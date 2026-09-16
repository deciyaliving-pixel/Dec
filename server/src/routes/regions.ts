import { Router } from "express";
import { getRepository } from "../lib/db.js";

export const regionsRouter = Router();

regionsRouter.get("/", async (_req, res) => {
  const regions = await getRepository().listRegions();
  res.json({ regions });
});

regionsRouter.get("/:slug", async (req, res) => {
  const region = await getRepository().getRegion(req.params.slug);
  if (!region) {
    res.status(404).json({ error: "Region not found." });
    return;
  }
  res.json({ region });
});
