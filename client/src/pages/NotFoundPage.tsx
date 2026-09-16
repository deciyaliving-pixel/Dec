import { Link } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export function NotFoundPage() {
  useDocumentMeta({ title: "Page Not Found — StayKhoj" });

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="kicker">404</p>
      <h1 className="mt-3 text-4xl">This page hasn&apos;t been mapped yet</h1>
      <p className="mt-4 text-ink-500">
        The page you&apos;re looking for doesn&apos;t exist, or it may still be a draft pending publication.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-card bg-vermilion px-5 py-3 font-medium text-paper-light hover:bg-vermilion-dark"
      >
        Back to the homepage
      </Link>
    </div>
  );
}
