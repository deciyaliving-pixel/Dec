import { Router } from "express";
import { newsletterSignupSchema } from "@staykhoj/shared";
import { getRepository } from "../lib/db.js";

export const newsletterRouter = Router();

newsletterRouter.post("/", async (req, res) => {
  const parsed = newsletterSignupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "A valid email is required." });
    return;
  }
  await getRepository().addNewsletterSignup(parsed.data.email);
  res.status(201).json({ ok: true });
});
