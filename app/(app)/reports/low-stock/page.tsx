import { PageHeader } from "@/components/layout/PageHeader";
import { ExportCsvButton } from "@/components/reports/ExportCsvButton";
import { DataTable } from "@/components/ui/DataTable";
import { getLowStockReport } from "@/lib/queries/reports";

export default async function LowStockReportPage() {
  const data = await getLowStockReport();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Reports"
        title="Low-Stock Report"
        description="Products at or below reorder level that need attention."
        action={<ExportCsvButton filename="low-stock-report.csv" rows={data} />}
      />

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
            key: "stockQuantity",
            header: "Stock Qty",
            render: (row) => row.stockQuantity,
          },
          {
            key: "reorderLevel",
            header: "Reorder",
            render: (row) => row.reorderLevel,
          },
        ]}
      />
    </div>
  );
}
