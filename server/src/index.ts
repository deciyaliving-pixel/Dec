import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";

import { PORT, SITE_URL, IS_PRODUCTION } from "./lib/env.js";
import { attachUser } from "./middleware/auth.js";
import { getRepository } from "./lib/db.js";
import { isSupabaseConfigured } from "./lib/supabaseClient.js";
import { regionsRouter } from "./routes/regions.js";
import { destinationsRouter } from "./routes/destinations.js";
import { fieldNotesRouter } from "./routes/fieldNotes.js";
import { routeGuidesRouter } from "./routes/routeGuides.js";
import { favoritesRouter } from "./routes/favorites.js";
import { newsletterRouter } from "./routes/newsletter.js";
import { studioRouter } from "./routes/studio.js";
import { buildRobotsTxt, buildSitemapXml } from "./seo/sitemap.js";
import { injectHtml } from "./seo/htmlInject.js";
import { resolveContentInjection } from "./seo/contentPages.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "../../client/dist");
const indexHtmlPath = path.join(clientDist, "index.html");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false, // Loosened for the Vite-built SPA + hotlinked Unsplash images; tighten once final asset hosts are locked in.
  }),
);
app.use(cors());
app.use(compression());
app.use(morgan(IS_PRODUCTION ? "combined" : "dev"));
app.use(express.json());
app.use(attachUser);

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, mode: isSupabaseConfigured ? "supabase" : "local-seed" });
});

app.use("/api/regions", regionsRouter);
app.use("/api/destinations", destinationsRouter);
app.use("/api/field-notes", fieldNotesRouter);
app.use("/api/routes", routeGuidesRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/studio", studioRouter);

app.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(buildRobotsTxt(SITE_URL));
});

app.get("/sitemap.xml", async (_req, res, next) => {
  try {
    const xml = await buildSitemapXml(getRepository(), SITE_URL);
    res.type("application/xml").send(xml);
  } catch (err) {
    next(err);
  }
});

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { index: false }));

  app.get(/^(?!\/api\/).*/, async (req, res, next) => {
    try {
      const template = fs.readFileSync(indexHtmlPath, "utf-8");
      const injection = await resolveContentInjection(getRepository(), SITE_URL, req.path);
      const html = injection ? injectHtml(template, SITE_URL, injection) : template;
      res.type("html").send(html);
    } catch (err) {
      next(err);
    }
  });
} else {
  app.get("/", (_req, res) => {
    res.type("text/plain").send(
      "StayKhoj API is running, but no client build was found at client/dist. Run `pnpm build` from the repo root, or `pnpm dev:client` alongside this server for local development.",
    );
  });
}

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `StayKhoj server listening on port ${PORT} (${isSupabaseConfigured ? "Supabase" : "local seed data"} mode)`,
  );
});
