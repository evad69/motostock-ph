import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdjustmentForm } from "@/components/stock/AdjustmentForm";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  getProducts,
  getProductById,
  getRelatedMovementsForProduct,
} from "@/lib/queries/products";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const [movements, products] = await Promise.all([
    Promise.resolve(getRelatedMovementsForProduct(id)),
    getProducts(),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow={product.category}
        title={product.name}
        description={`${product.brand} · ${product.motorcycleModel}`}
        action={
          <Link href={`/products/${id}/edit`} className="button-primary">
            Edit Product
          </Link>
        }
      />

      <section className="grid gap-8 border-b border-[var(--color-line)] pb-10 lg:grid-cols-4">
        <article className="space-y-3 lg:col-span-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            Product Photo
          </p>
          {product.photoUrl ? (
            <img
              src={product.photoUrl}
              alt={product.name}
              className="aspect-[4/3] w-full max-w-xl border border-[var(--color-line)] object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full max-w-xl items-center justify-center border border-[var(--color-line)] text-sm text-[color:var(--color-muted)]">
              No product photo
            </div>
          )}
        </article>
        <article className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            SKU
          </p>
          <p className="text-lg font-medium">{product.sku}</p>
        </article>
        <article className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            Selling Price
          </p>
          <p className="text-lg font-medium">PHP {product.sellingPrice}</p>
        </article>
        <article className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            Stock
          </p>
          <p className="text-lg font-medium">{product.stockQuantity}</p>
        </article>
        <article className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            Status
          </p>
          <StatusBadge
            tone={
              product.status === "Healthy"
                ? "success"
                : product.status === "Low"
                  ? "warning"
                  : "danger"
            }
          >
            {product.status}
          </StatusBadge>
        </article>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Movement History
            </p>
            <h2 className="mt-2 font-display text-3xl uppercase tracking-[-0.05em]">
              Recent activity for this product
            </h2>
          </div>

          <DataTable
            rows={movements}
            columns={[
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

        <AdjustmentForm
          products={products}
          defaultProductId={id}
          inventory={{
            productId: product.id,
            productName: product.name,
            reorderLevel: product.reorderLevel,
            status: product.status,
            stockQuantity: product.stockQuantity,
          }}
        />
      </section>
    </div>
  );
}
