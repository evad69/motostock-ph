import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { getSuppliers } from "@/lib/queries/suppliers";

export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const suppliers = await getSuppliers(search);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Vendors"
        title="Suppliers"
        action={<Link className="button-primary" href="/suppliers/new">Add Supplier</Link>}
      />

      <form className="grid gap-4 border-b border-[var(--color-line)] pb-8 md:grid-cols-[minmax(0,1fr)_auto]">
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search supplier name"
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none placeholder:text-[color:var(--color-muted)] focus:border-[var(--color-accent)]"
        />
        <button type="submit" className="button-secondary">
          Search
        </button>
      </form>

      <DataTable
        rows={suppliers}
        columns={[
          {
            key: "name",
            header: "Name",
            render: (row) => <Link href={`/suppliers/${row.id}`}>{row.name}</Link>,
          },
          { key: "contact", header: "Contact", render: (row) => row.contact },
          { key: "location", header: "Location", render: (row) => row.location },
          {
            key: "lastDelivery",
            header: "Last Delivery",
            render: (row) => row.lastDelivery,
          },
        ]}
      />
    </div>
  );
}
