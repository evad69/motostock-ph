import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PrintButton } from "@/components/sales/PrintButton";
import { getSaleById } from "@/lib/queries/sales";

export default async function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sale = await getSaleById(id);

  if (!sale) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Receipt"
        title={`Sale ${sale.id}`}
        description={`Created ${new Date(sale.createdAt).toLocaleString("en-PH")}`}
        action={<PrintButton />}
      />

      <section className="grid gap-8 border-b border-[var(--color-line)] pb-8 lg:grid-cols-3">
        <article className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            Customer
          </p>
          <p className="text-lg font-medium">{sale.customerName || "Walk-in"}</p>
        </article>
        <article className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            Items
          </p>
          <p className="text-lg font-medium">{sale.items.length}</p>
        </article>
        <article className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            Total
          </p>
          <p className="text-lg font-medium">PHP {sale.totalAmount}</p>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            Line Items
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase tracking-[-0.05em]">
            Receipt breakdown
          </h2>
        </div>

        <div className="grid gap-3 border-t border-[var(--color-line)] pt-4">
          {sale.items.map((item) => (
            <div
              key={`${sale.id}-${item.productId}`}
              className="grid gap-3 border-b border-[rgba(17,22,29,0.08)] pb-4 lg:grid-cols-[1.4fr_0.6fr_0.6fr_0.6fr]"
            >
              <p>{item.productName}</p>
              <p>PHP {item.unitPrice}</p>
              <p>{item.quantity}</p>
              <p>PHP {item.subtotal}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
