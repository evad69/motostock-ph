import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdjustmentForm } from "@/components/stock/AdjustmentForm";
import { ExportCsvButton } from "@/components/reports/ExportCsvButton";
import { StockInForm } from "@/components/stock/StockInForm";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getMovements } from "@/lib/queries/stockMovements";
import { getProducts } from "@/lib/queries/products";

export default async function MovementsPage({
  searchParams,
}: {
  searchParams: Promise<{
    product?: string;
    type?: "stock_in" | "sale" | "adjustment";
    dateFrom?: string;
    dateTo?: string;
  }>;
}) {
  const filters = await searchParams;
  const [recentMovements, products] = await Promise.all([
    getMovements(filters),
    getProducts(),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Stock Movements"
        title="Movement History"
        description="Review stock-in, sales, and manual adjustments with filtering and export for audits or reconciliation."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <ExportCsvButton
              filename="movement-history.csv"
              rows={recentMovements.map((movement) => ({
                id: movement.id,
                date: movement.date,
                time: movement.timestamp,
                product: movement.product,
                type: movement.type,
                quantity: movement.quantity,
                note: movement.note,
              }))}
            />
            <Link href="/products" className="button-secondary">
              Back to Products
            </Link>
          </div>
        }
      />

      <form className="grid gap-4 border-b border-[var(--color-line)] pb-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto]">
        <input
          type="search"
          name="product"
          defaultValue={filters.product}
          placeholder="Filter by product"
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none placeholder:text-[color:var(--color-muted)] focus:border-[var(--color-accent)]"
        />
        <select
          name="type"
          defaultValue={filters.type ?? ""}
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
        >
          <option value="">All movement types</option>
          <option value="stock_in">Stock In</option>
          <option value="sale">Sale</option>
          <option value="adjustment">Adjustment</option>
        </select>
        <input
          type="date"
          name="dateFrom"
          defaultValue={filters.dateFrom}
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
        />
        <input
          type="date"
          name="dateTo"
          defaultValue={filters.dateTo}
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
        />
        <button type="submit" className="button-secondary">
          Apply Filters
        </button>
      </form>

      <section className="grid gap-8 lg:grid-cols-2">
        <StockInForm products={products} />
        <AdjustmentForm products={products} />
      </section>

      <DataTable
        rows={recentMovements}
        columns={[
          { key: "date", header: "Date", render: (row) => row.date },
          { key: "timestamp", header: "Time", render: (row) => row.timestamp },
          { key: "product", header: "Product", render: (row) => row.product },
          {
            key: "type",
            header: "Type",
            render: (row) => (
              <StatusBadge
                tone={
                  row.type === "stock_in"
                    ? "success"
                    : row.type === "sale"
                      ? "warning"
                      : "danger"
                }
              >
                {row.type}
              </StatusBadge>
            ),
          },
          { key: "quantity", header: "Qty", render: (row) => row.quantity },
          { key: "note", header: "Note", render: (row) => row.note },
        ]}
      />
    </div>
  );
}
