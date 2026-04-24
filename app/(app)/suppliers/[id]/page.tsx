import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { DeleteSupplierButton } from "@/components/suppliers/DeleteSupplierButton";
import { DataTable } from "@/components/ui/DataTable";
import { getSupplierById } from "@/lib/queries/suppliers";

export default async function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplier = await getSupplierById(id);

  if (!supplier) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Supplier Detail"
        title={supplier.name}
        description={supplier.notes || "Supplier record and linked stock-in history."}
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/suppliers" className="button-secondary">
              Back to Suppliers
            </Link>
            <DeleteSupplierButton supplierId={supplier.id} />
          </div>
        }
      />

      <section className="grid gap-8 border-b border-[var(--color-line)] pb-10 lg:grid-cols-3">
        <article className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            Contact
          </p>
          <p className="text-lg font-medium">{supplier.contactNumber}</p>
        </article>
        <article className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            Address
          </p>
          <p className="text-lg font-medium">{supplier.address}</p>
        </article>
        <article className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            Purchase Records
          </p>
          <p className="text-lg font-medium">{supplier.purchaseHistory.length}</p>
        </article>
      </section>

      <section className="space-y-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            Purchase History
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase tracking-[-0.05em]">
            Linked stock-in records
          </h2>
        </div>

        <DataTable
          rows={supplier.purchaseHistory}
          columns={[
            { key: "date", header: "Date", render: (row) => row.date },
            { key: "product", header: "Product", render: (row) => row.product },
            { key: "quantity", header: "Quantity", render: (row) => row.quantity },
            { key: "note", header: "Note", render: (row) => row.note },
          ]}
        />
      </section>
    </div>
  );
}
