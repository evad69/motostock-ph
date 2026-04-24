import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-6 py-12 sm:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-accent)]">
        404 / Not Found
      </p>
      <div className="space-y-4">
        <h1 className="font-display text-5xl uppercase tracking-[-0.06em] sm:text-6xl">
          The requested record or page does not exist.
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-muted)]">
          The link may be outdated, the record may have been archived, or the route
          was entered incorrectly.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href="/dashboard" className="button-primary">
          Go to Dashboard
        </Link>
        <Link href="/" className="button-secondary">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
