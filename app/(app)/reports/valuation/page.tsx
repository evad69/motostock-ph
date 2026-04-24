import { PageHeader } from "@/components/layout/PageHeader";
import { ExportCsvButton } from "@/components/reports/ExportCsvButton";
import { DataTable } from "@/components/ui/DataTable";
import { getInventoryValuation } from "@/lib/queries/reports";

export default async function InventoryValuationPage() {
  const data = await getInventoryValuation();
  const totalValue = data.reduce((sum, row) => sum + row.totalValue, 0);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Reports"
        title="Inventory Valuation"
        description="Estimate on-hand inventory value using cost price multiplied by current stock."
        action={<ExportCsvButton filename="inventory-valuation.csv" rows={data} />}
      />

      <section className="border-t border-[var(--color-line)] pt-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
          Total Estimated Value
        </p>
        <p className="mt-3 font-display text-5xl uppercase tracking-[-0.07em]">
          PHP {totalValue}
        </p>
      </section>

      <DataTable
        rows={data}
        columns={[
          {
            key: "productName",
            header: "Product",
            render: (row) => row.productName,
          },
          { key: "category", header: "Category", render: (row) => row.category },
          { key: "brand", header: "Brand", render: (row) => row.brand },
          {
            key: "costPrice",
            header: "Cost Price",
            render: (row) => `PHP ${row.costPrice}`,
          },
          {
            key: "stockQuantity",
            header: "Stock",
            render: (row) => row.stockQuantity,
          },
          {
            key: "totalValue",
            header: "Total Value",
            render: (row) => `PHP ${row.totalValue}`,
          },
        ]}
      />
    </div>
  );
}
