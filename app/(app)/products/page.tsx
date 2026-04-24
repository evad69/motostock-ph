import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ArchiveProductButton } from "@/components/products/ArchiveProductButton";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getProducts } from "@/lib/queries/products";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    stockStatus?: "healthy" | "low" | "out";
  }>;
}) {
  const filters = await searchParams;
  const products = await getProducts(filters);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        action={<Link className="button-primary" href="/products/new">Add Product</Link>}
      />

      <section className="grid gap-4 border-b border-[var(--color-line)] pb-8 md:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.8fr))]">
        <input
          type="search"
          defaultValue={filters.search}
          placeholder="Search by part name or SKU"
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent px-0 py-3 outline-none placeholder:text-[color:var(--color-muted)] focus:border-[var(--color-accent)]"
        />
        <input
          type="text"
          defaultValue={filters.category}
          placeholder="Category"
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent px-0 py-3 outline-none placeholder:text-[color:var(--color-muted)] focus:border-[var(--color-accent)]"
        />
        <input
          type="text"
          defaultValue={filters.brand}
          placeholder="Brand"
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent px-0 py-3 outline-none placeholder:text-[color:var(--color-muted)] focus:border-[var(--color-accent)]"
        />
        <input
          type="text"
          defaultValue={filters.stockStatus}
          placeholder="Stock status"
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent px-0 py-3 outline-none placeholder:text-[color:var(--color-muted)] focus:border-[var(--color-accent)]"
        />
      </section>

      <DataTable
        rows={products}
        columns={[
          {
            key: "name",
            header: "Name",
            render: (row) => (
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                  {row.sku}
                </p>
                <Link
                  href={`/products/${row.id}`}
                  className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]"
                >
                  View details
                </Link>
              </div>
            ),
          },
          { key: "brand", header: "Brand", render: (row) => row.brand },
          { key: "category", header: "Category", render: (row) => row.category },
          {
            key: "stock",
            header: "Stock",
            render: (row) => (
              <div>
                <p>{row.stock}</p>
                <p className="text-xs text-[color:var(--color-muted)]">
                  reorder {row.reorderLevel}
                </p>
              </div>
            ),
          },
          { key: "price", header: "Price", render: (row) => row.price },
          {
            key: "status",
            header: "Status",
            render: (row) => (
              <StatusBadge
                tone={
                  row.status === "Healthy"
                    ? "success"
                    : row.status === "Low"
                      ? "warning"
                      : "danger"
                }
              >
                {row.status}
              </StatusBadge>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link className="button-secondary" href={`/products/${row.id}/edit`}>
                  Edit
                </Link>
                <ArchiveProductButton productId={row.id} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
