import { Suspense } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen bg-[var(--color-canvas)] lg:grid-cols-[minmax(0,1.08fr)_minmax(28rem,0.92fr)]">
      <section className="grid-lines relative hidden overflow-hidden border-r border-[var(--color-line)] px-10 py-12 lg:flex lg:flex-col lg:justify-between xl:px-14 xl:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,176,32,0.14),_transparent_34%)]" />
        <div className="relative space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-accent)]">
            MotoStock PH
          </p>
          <h1 className="max-w-[34rem] font-display text-5xl uppercase leading-[0.92] tracking-[-0.07em] xl:text-[5.5rem]">
            Inventory that moves at shop speed.
          </h1>
          <p className="max-w-lg text-base leading-8 text-[color:var(--color-muted)]">
            Built for the daily rhythm of a motorcycle parts counter.
          </p>
        </div>
        <div className="relative h-px w-24 bg-[var(--color-accent)]" />
      </section>
      <section className="overflow-y-auto px-6 py-8 sm:px-10 lg:px-12 lg:py-12 xl:px-16 xl:py-14">
        <div className="mx-auto w-full max-w-[32rem]">
          <Suspense fallback={<PageLoader />}>{children}</Suspense>
        </div>
      </section>
    </div>
  );
}
