"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)]">
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-6 py-12 sm:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-danger)]">
            Application Error
          </p>
          <div className="space-y-4">
            <h1 className="font-display text-5xl uppercase tracking-[-0.06em] sm:text-6xl">
              Something broke in the current route.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-muted)]">
              {error.message || "An unexpected error occurred while rendering this page."}
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button type="button" className="button-primary" onClick={() => reset()}>
              Try Again
            </button>
            <Link href="/dashboard" className="button-secondary">
              Return to Dashboard
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
