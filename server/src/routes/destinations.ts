import { Router } from "express";
import { getRepository } from "../lib/db.js";
import { parseContentFilter } from "../lib/parseFilter.js";

export const destinationsRouter = Router();

destinationsRouter.get("/", async (req, res) => {
  const destinations = await getRepository().listDestinations(parseContentFilter(req));
  res.json({ destinations });
});

destinationsRouter.get("/:slug", async (req, res) => {
  const destination = await getRepository().getDestination(req.params.slug);
  if (!destination) {
    res.status(404).json({ error: "Destination not found." });
    return;
  }
  const author = await getRepository().getAuthor(destination.authorId);
  res.json({ destination, author });
});
