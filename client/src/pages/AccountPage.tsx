import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { isAuthConfigured, supabase } from "../lib/supabaseClient";
import { api } from "../lib/api";

export function AccountPage() {
  useDocumentMeta({ title: "Your Account — StayKhoj" });

  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [isEditor, setIsEditor] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsEditor(false);
      setFavorites([]);
      return;
    }
    api.studio.me().then((res) => setIsEditor(Boolean(res.user?.isEditor)));
    api.favorites.list().then(setFavorites).catch(() => setFavorites([]));
  }, [session]);

  if (!isAuthConfigured) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 sm:px-6">
        <p className="kicker">Account</p>
        <h1 className="mt-2 text-4xl">Sign-in isn&apos;t configured yet</h1>
        <p className="mt-4 text-ink-500">
          This deployment doesn&apos;t have Supabase auth configured. Set <code>VITE_SUPABASE_URL</code> and{" "}
          <code>VITE_SUPABASE_ANON_KEY</code> (see <code>.env.example</code>) to enable magic-link sign-in.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setStatus("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/account` },
    });
    setStatus(error ? "error" : "sent");
  }

  async function handleSignOut() {
    await supabase?.auth.signOut();
  }

  if (session) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 sm:px-6">
        <p className="kicker">Account</p>
        <h1 className="mt-2 text-4xl">Welcome back</h1>
        <p className="mt-4 text-ink-500">Signed in as {session.user.email}.</p>

        {isEditor && (
          <Link
            to="/studio"
            className="mt-6 inline-block rounded-card bg-ink px-5 py-3 font-medium text-paper hover:bg-ink-700"
          >
            Open the Studio
          </Link>
        )}

        <div className="mt-10 border-t border-ink/15 pt-6">
          <p className="kicker mb-3">Your Favorites</p>
          {favorites.length === 0 ? (
            <p className="text-ink-500">No favorited destinations yet.</p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-ink-700">
              {favorites.map((slug) => (
                <li key={slug}>{slug}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="mt-10 rounded-card border border-ink/30 px-4 py-2 text-sm font-medium hover:border-vermilion hover:text-vermilion"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-24 sm:px-6">
      <p className="kicker">Account</p>
      <h1 className="mt-2 text-4xl">Sign in with a magic link</h1>
      <p className="mt-4 text-ink-500">No password &mdash; we&apos;ll email you a one-time sign-in link.</p>

      {status === "sent" ? (
        <p className="mt-6 font-medium text-sage-dark">Check your inbox for a sign-in link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="account-email" className="sr-only">
            Email address
          </label>
          <input
            id="account-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-card border border-ink/30 bg-paper px-4 py-2.5 text-ink placeholder:text-ink-300 focus:border-vermilion sm:max-w-xs"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-card bg-vermilion px-5 py-2.5 font-medium text-paper-light hover:bg-vermilion-dark disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send magic link"}
          </button>
        </form>
      )}
      {status === "error" && <p className="mt-3 text-sm text-vermilion-dark">Something went wrong. Try again.</p>}
    </div>
  );
}
