import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { getSales } from "@/lib/queries/sales";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{
    customer?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}) {
  const filters = await searchParams;
  const sales = await getSales(filters);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Transactions"
        title="Sales"
        action={<Link className="button-primary" href="/sales/new">New Sale</Link>}
      />

      <form className="grid gap-4 border-b border-[var(--color-line)] pb-8 md:grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,0.7fr))_auto]">
        <input
          type="search"
          name="customer"
          defaultValue={filters.customer}
          placeholder="Customer or Walk-in"
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none placeholder:text-[color:var(--color-muted)] focus:border-[var(--color-accent)]"
        />
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
          Filter
        </button>
      </form>

      <DataTable
        rows={sales}
        columns={[
          {
            key: "date",
            header: "Date",
            render: (row) => <Link href={`/sales/${row.id}`}>{row.date}</Link>,
          },
          { key: "customer", header: "Customer", render: (row) => row.customer },
          { key: "items", header: "Items", render: (row) => row.items },
          { key: "total", header: "Total", render: (row) => row.total },
        ]}
      />
    </div>
  );
}
