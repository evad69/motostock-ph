import { PageHeader } from "@/components/layout/PageHeader";
import { ExportCsvButton } from "@/components/reports/ExportCsvButton";
import { TopPartsChartPanel } from "@/components/reports/TopPartsChartPanel";
import { DataTable } from "@/components/ui/DataTable";
import { getTopSellingParts } from "@/lib/queries/reports";

export default async function TopPartsReportPage() {
  const data = await getTopSellingParts();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Reports"
        title="Top-Selling Parts"
        description="See which products are moving fastest by quantity sold."
        action={<ExportCsvButton filename="top-selling-parts.csv" rows={data} />}
      />

      <TopPartsChartPanel data={data} />

      <DataTable
        rows={data}
        columns={[
          {
            key: "productName",
            header: "Product",
            render: (row) => row.productName,
          },
          {
            key: "quantitySold",
            header: "Qty Sold",
            render: (row) => row.quantitySold,
          },
          {
            key: "revenue",
            header: "Revenue",
            render: (row) => `PHP ${row.revenue}`,
          },
        ]}
      />
    </div>
  );
}
