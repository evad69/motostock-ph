import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  getDashboardMetrics,
  getLowStockItems,
  getRecentMovements,
} from "@/lib/queries/dashboard";

export default async function DashboardPage() {
  const [dashboardMetrics, lowStockItems, recentMovements] = await Promise.all([
    getDashboardMetrics(),
    getLowStockItems(),
    getRecentMovements(10),
  ]);

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Operations"
        title="Dashboard"
        action={<Link className="button-primary" href="/products">Review Products</Link>}
      />

      <section className="grid gap-8 border-b border-[var(--color-line)] pb-12 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <article key={metric.label} className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
              {metric.label}
            </p>
            <p
              className={`font-display text-5xl uppercase leading-none tracking-[-0.08em] sm:text-6xl ${
                metric.accent ? "text-[var(--color-accent-strong)]" : ""
              }`}
            >
              {metric.value}
            </p>
            <p className="text-sm leading-7 text-[color:var(--color-muted)]">
              {metric.hint}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-10 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
                Recent Movements
              </p>
              <h2 className="mt-2 font-display text-3xl uppercase tracking-[-0.05em]">
                Last recorded stock activity
              </h2>
            </div>
          </div>

          <DataTable
            rows={recentMovements}
            columns={[
              {
                key: "timestamp",
                header: "Time",
                render: (row) => (
                  <div>
                    <p className="font-medium">{row.timestamp}</p>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                      {row.id}
                    </p>
                  </div>
                ),
              },
              {
                key: "product",
                header: "Product",
                render: (row) => row.product,
              },
              {
                key: "type",
                header: "Type",
                render: (row) => {
                  const tone =
                    row.type === "stock_in"
                      ? "success"
                      : row.type === "sale"
                        ? "warning"
                        : "danger";

                  return <StatusBadge tone={tone}>{row.type}</StatusBadge>;
                },
              },
              {
                key: "quantity",
                header: "Qty",
                render: (row) => <span className="font-mono">{row.quantity}</span>,
              },
              {
                key: "note",
                header: "Note",
                render: (row) => row.note,
              },
            ]}
          />
        </div>

        <div className="grid gap-8">
          <section className="space-y-4 border-t border-[var(--color-line)] pt-5">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Quick Actions
            </p>
            <div className="grid gap-3">
              <Link href="/sales" className="button-secondary justify-between">
                Record a new sale
              </Link>
              <Link href="/movements" className="button-secondary justify-between">
                Log stock-in or adjustment
              </Link>
              <Link href="/reports" className="button-secondary justify-between">
                Review daily reports
              </Link>
            </div>
          </section>

          <section className="space-y-4 border-t border-[var(--color-line)] pt-5">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Low-Stock Alert
            </p>
            <div className="grid gap-3">
              {lowStockItems.map((item) => (
                <div
                  key={item}
                  className="border-b border-[rgba(17,22,29,0.08)] pb-3 text-sm leading-7"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
