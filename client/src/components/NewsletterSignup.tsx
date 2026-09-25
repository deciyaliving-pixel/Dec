import { useState, type FormEvent } from "react";
import { api } from "../lib/api";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.newsletter.signUp(email);
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="dashed-block bg-paper-light px-6 py-8 sm:px-10">
      <p className="kicker">Field Notes, Fortnightly</p>
      <h2 className="mt-2 text-2xl">A postcard in your inbox, not a push notification</h2>
      <p className="mt-2 max-w-xl text-ink-500">
        New field notes, seasonal planning updates, and route guides &mdash; no more than twice a month.
      </p>
      {status === "done" ? (
        <p className="mt-4 font-medium text-sage-dark">You&apos;re on the list. Thank you.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-card border border-ink/30 bg-paper px-4 py-2.5 text-ink placeholder:text-ink-300 focus:border-vermilion sm:max-w-xs"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-card bg-vermilion px-5 py-2.5 font-medium text-paper-light transition-colors hover:bg-vermilion-dark disabled:opacity-60"
          >
            {status === "loading" ? "Signing up…" : "Sign up"}
          </button>
        </form>
      )}
      {status === "error" && <p className="mt-3 text-sm text-vermilion-dark">Something went wrong. Try again.</p>}
    </div>
  );
}
