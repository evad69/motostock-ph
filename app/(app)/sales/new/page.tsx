import { PageHeader } from "@/components/layout/PageHeader";
import { SaleForm } from "@/components/sales/SaleForm";
import { getSaleCatalog } from "@/lib/queries/sales";

export default async function NewSalePage() {
  const products = await getSaleCatalog();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Sales Entry"
        title="New Sale"
        description="Record a walk-in transaction with multiple items, live subtotals, and server-side sale creation."
      />

      <SaleForm products={products} />
    </div>
  );
}
