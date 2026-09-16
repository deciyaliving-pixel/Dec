import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { isAuthConfigured } from "../lib/supabaseClient";
import { api } from "../lib/api";
import { ContentForm } from "../components/studio/ContentForm";
import { ContentPreview, SeoPreviewPanel } from "../components/studio/ContentPreview";
import { blankItem, KIND_LABELS, type StudioItem, type StudioKind } from "../studio/types";

type MeState = { id: string; email?: string; isEditor: boolean } | null | "loading";

export function StudioPage() {
  useDocumentMeta({ title: "Studio — StayKhoj" });

  const [me, setMe] = useState<MeState>("loading");

  useEffect(() => {
    api.studio
      .me()
      .then((res) => setMe(res.user))
      .catch(() => setMe(null));
  }, []);

  if (!isAuthConfigured) {
    return (
      <Gate
        title="Studio requires Supabase auth"
        message="Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example) to enable Studio sign-in."
      />
    );
  }

  if (me === "loading") {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-ink-500 sm:px-6">Checking access&#8230;</div>;
  }

  if (!me) {
    return (
      <Gate
        title="Sign in required"
        message="The Studio is editor-only."
        action={
          <Link to="/account" className="mt-4 inline-block rounded-card bg-vermilion px-5 py-3 font-medium text-paper-light">
            Go to sign in
          </Link>
        }
      />
    );
  }

  if (!me.isEditor) {
    return <Gate title="Editor access required" message={`${me.email} is signed in but isn't an editor yet.`} />;
  }

  return <StudioWorkspace />;
}

function Gate({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 sm:px-6">
      <p className="kicker">Studio</p>
      <h1 className="mt-2 text-4xl">{title}</h1>
      <p className="mt-4 text-ink-500">{message}</p>
      {action}
    </div>
  );
}

function StudioWorkspace() {
  const [kind, setKind] = useState<StudioKind>("fieldNotes");
  const [items, setItems] = useState<StudioItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<StudioItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [issues, setIssues] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    setSelectedSlug(null);
    setDraft(null);
    const list = kind === "destinations" ? api.studio.destinations.list() : kind === "fieldNotes" ? api.studio.fieldNotes.list() : api.studio.routes.list();
    list.then((res) => setItems(res as StudioItem[]));
  }, [kind]);

  function selectItem(item: StudioItem) {
    setSelectedSlug(item.slug);
    setDraft(item);
    setIsNew(false);
    setIssues([]);
    setMode("edit");
  }

  function newItem() {
    const slug = window.prompt("Slug for the new entry (lowercase, hyphenated):");
    if (!slug) return;
    const item = blankItem(kind, slug);
    setSelectedSlug(slug);
    setDraft(item);
    setIsNew(true);
    setIssues([]);
    setMode("edit");
  }

  async function save() {
    if (!draft) return;
    setSaveState("saving");
    setIssues([]);
    try {
      const putFn = kind === "destinations" ? api.studio.destinations.put : kind === "fieldNotes" ? api.studio.fieldNotes.put : api.studio.routes.put;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const saved = await (putFn as any)(draft.slug, draft);
      const savedItem = (saved.destination ?? saved.fieldNote ?? saved.route) as StudioItem;
      setDraft(savedItem);
      setIsNew(false);
      setItems((prev) => {
        const exists = prev.some((p) => p.slug === savedItem.slug);
        return exists ? prev.map((p) => (p.slug === savedItem.slug ? savedItem : p)) : [...prev, savedItem];
      });
      setSaveState("saved");
    } catch (err) {
      setSaveState("idle");
      const message = err instanceof Error ? err.message : "Save failed.";
      setIssues([message]);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="kicker">Studio</p>
      <h1 className="mt-2 text-4xl">Content Editor</h1>

      <div className="mt-6 flex gap-2">
        {(Object.keys(KIND_LABELS) as StudioKind[]).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              kind === k ? "border-vermilion bg-vermilion text-paper-light" : "border-ink/25 text-ink-500"
            }`}
          >
            {KIND_LABELS[k]}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside>
          <button onClick={newItem} className="mb-4 w-full rounded-card bg-ink px-3 py-2 text-sm font-medium text-paper">
            + New {KIND_LABELS[kind].slice(0, -1)}
          </button>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.slug}>
                <button
                  onClick={() => selectItem(item)}
                  className={`block w-full rounded-card px-3 py-2 text-left text-sm ${
                    selectedSlug === item.slug ? "bg-paper-dark font-medium" : "hover:bg-paper-dark/50"
                  }`}
                >
                  <span className="block truncate">{item.title || item.slug}</span>
                  <span className="text-xs text-ink-500">
                    {item.status} &middot; {item.reportingStatus === "verified_firsthand" ? "verified" : "planning"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {!draft ? (
            <p className="text-ink-500">Select an item to edit, or create a new one.</p>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <ModeButton active={mode === "edit"} onClick={() => setMode("edit")} label="Edit" />
                  <ModeButton active={mode === "preview"} onClick={() => setMode("preview")} label="Preview" />
                </div>
                <button
                  onClick={save}
                  disabled={saveState === "saving"}
                  className="rounded-card bg-vermilion px-4 py-2 text-sm font-medium text-paper-light hover:bg-vermilion-dark disabled:opacity-60"
                >
                  {saveState === "saving" ? "Saving…" : "Save"}
                </button>
              </div>

              {issues.length > 0 && (
                <ul className="mb-6 space-y-1 rounded-card border border-vermilion/40 bg-vermilion/5 p-4 text-sm text-vermilion-dark">
                  {issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              )}
              {saveState === "saved" && <p className="mb-6 text-sm text-sage-dark">Saved.</p>}

              {mode === "edit" ? (
                <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
                  <ContentForm kind={kind} item={draft} isNew={isNew} onChange={setDraft} />
                  <SeoPreviewPanel item={draft} />
                </div>
              ) : (
                <ContentPreview item={draft} kind={kind} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ModeButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-card border px-4 py-2 text-sm font-medium ${
        active ? "border-ink bg-ink text-paper" : "border-ink/25 text-ink-500"
      }`}
    >
      {label}
    </button>
  );
}
