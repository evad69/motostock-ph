import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { getReportHighlights } from "@/lib/queries/reports";

export default async function ReportsPage() {
  const reportHighlights = await getReportHighlights();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Reports"
        title="Reports Overview"
      />

      <section className="grid gap-8 border-t border-[var(--color-line)] pt-8 lg:grid-cols-3">
        {reportHighlights.map((item) => (
          <article key={item.title} className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
              {item.title}
            </p>
            <p className="font-display text-4xl uppercase leading-none tracking-[-0.06em]">
              {item.value}
            </p>
            <p className="text-sm leading-7 text-[color:var(--color-muted)]">
              {item.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 border-t border-[var(--color-line)] pt-8 lg:grid-cols-2">
        <Link href="/reports/sales" className="button-secondary justify-between">
          Daily Sales Report
        </Link>
        <Link href="/reports/top-parts" className="button-secondary justify-between">
          Top-Selling Parts
        </Link>
        <Link href="/reports/low-stock" className="button-secondary justify-between">
          Low-Stock Report
        </Link>
        <Link href="/reports/valuation" className="button-secondary justify-between">
          Inventory Valuation
        </Link>
      </section>
    </div>
  );
}
