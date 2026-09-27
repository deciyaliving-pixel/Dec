export const PORT = Number(process.env.PORT ?? 8787);
// RENDER_EXTERNAL_URL is auto-injected by Render (https://docs.render.com/environment-variables)
// so SITE_URL doesn't need to be set by hand on that platform; SITE_URL still wins if set explicitly.
export const SITE_URL = (
  process.env.SITE_URL ??
  process.env.RENDER_EXTERNAL_URL ??
  `http://localhost:${PORT}`
).replace(/\/$/, "");
export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const IS_PRODUCTION = NODE_ENV === "production";
// Shared secret required by the MCP connector's write tools (e.g. drafting a
// field note). Read-only MCP tools work without it; write tools are simply
// unavailable (and error clearly) if it isn't set.
export const MCP_ADMIN_TOKEN = process.env.MCP_ADMIN_TOKEN ?? null;
