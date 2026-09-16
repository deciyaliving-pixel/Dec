import { Router } from "express";
import { FIELD_NOTE_CATEGORIES } from "@staykhoj/shared";
import { getRepository } from "../lib/db.js";
import { parseContentFilter } from "../lib/parseFilter.js";

export const fieldNotesRouter = Router();

fieldNotesRouter.get("/", async (req, res) => {
  const filter = parseContentFilter(req);
  const category = req.query.category;
  const withCategory =
    typeof category === "string" && (FIELD_NOTE_CATEGORIES as readonly string[]).includes(category)
      ? { ...filter, category }
      : filter;
  const fieldNotes = await getRepository().listFieldNotes(withCategory);
  res.json({ fieldNotes });
});

fieldNotesRouter.get("/:slug", async (req, res) => {
  const fieldNote = await getRepository().getFieldNote(req.params.slug);
  if (!fieldNote) {
    res.status(404).json({ error: "Field note not found." });
    return;
  }
  const author = await getRepository().getAuthor(fieldNote.authorId);
  res.json({ fieldNote, author });
});
