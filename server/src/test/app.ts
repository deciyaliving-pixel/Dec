import express from "express";
import { attachUser } from "../middleware/auth.js";
import { regionsRouter } from "../routes/regions.js";
import { destinationsRouter } from "../routes/destinations.js";
import { fieldNotesRouter } from "../routes/fieldNotes.js";
import { routeGuidesRouter } from "../routes/routeGuides.js";
import { favoritesRouter } from "../routes/favorites.js";
import { newsletterRouter } from "../routes/newsletter.js";
import { studioRouter } from "../routes/studio.js";

/** A minimal Express app (no static serving, no helmet/morgan noise) for API tests. */
export function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(attachUser);
  app.use("/api/regions", regionsRouter);
  app.use("/api/destinations", destinationsRouter);
  app.use("/api/field-notes", fieldNotesRouter);
  app.use("/api/routes", routeGuidesRouter);
  app.use("/api/favorites", favoritesRouter);
  app.use("/api/newsletter", newsletterRouter);
  app.use("/api/studio", studioRouter);
  return app;
}
