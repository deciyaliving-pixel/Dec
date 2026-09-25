import type { NextFunction, Request, Response } from "express";
import { isSupabaseConfigured } from "../lib/supabaseClient.js";
import { getSupabaseAdmin } from "../lib/supabaseClient.js";
import { getRepository } from "../lib/db.js";

export interface AuthedUser {
  id: string;
  email?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthedUser;
    }
  }
}

const devAuthBypassEnabled = process.env.DEV_AUTH_BYPASS === "true" && process.env.NODE_ENV !== "production";

/**
 * Resolves req.user from a Supabase JWT (Authorization: Bearer <token>).
 * Never blocks the request — routes that require auth should follow this
 * with requireAuth / requireEditor.
 */
export async function attachUser(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const header = req.header("authorization") ?? req.header("Authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (token && isSupabaseConfigured) {
    try {
      const { data, error } = await getSupabaseAdmin().auth.getUser(token);
      if (!error && data.user) {
        req.user = { id: data.user.id, email: data.user.email ?? undefined };
      }
    } catch {
      // Invalid/expired token: leave req.user unset rather than failing the request here.
    }
  } else if (!isSupabaseConfigured && devAuthBypassEnabled) {
    // Local/dev only: DEV_AUTH_BYPASS lets the Studio UI be exercised without a live
    // Supabase project. This branch is inert whenever Supabase is configured or in production.
    req.user = { id: "dev-user", email: "dev@staykhoj.local" };
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: "Sign in required." });
    return;
  }
  next();
}

export async function requireEditor(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: "Sign in required." });
    return;
  }
  const isEditor = await getRepository().isEditor(req.user.id);
  if (!isEditor) {
    res.status(403).json({ error: "Editor access required." });
    return;
  }
  next();
}
