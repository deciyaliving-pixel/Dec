export const PORT = Number(process.env.PORT ?? 8787);
export const SITE_URL = (process.env.SITE_URL ?? `http://localhost:${PORT}`).replace(/\/$/, "");
export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const IS_PRODUCTION = NODE_ENV === "production";
