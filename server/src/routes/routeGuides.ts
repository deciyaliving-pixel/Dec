import { Router } from "express";
import { getRepository } from "../lib/db.js";
import { parseContentFilter } from "../lib/parseFilter.js";

export const routeGuidesRouter = Router();

routeGuidesRouter.get("/", async (req, res) => {
  const routes = await getRepository().listRoutes(parseContentFilter(req));
  res.json({ routes });
});

routeGuidesRouter.get("/:slug", async (req, res) => {
  const route = await getRepository().getRoute(req.params.slug);
  if (!route) {
    res.status(404).json({ error: "Route not found." });
    return;
  }
  const author = await getRepository().getAuthor(route.authorId);
  res.json({ route, author });
});
