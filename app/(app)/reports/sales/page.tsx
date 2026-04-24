import { PageHeader } from "@/components/layout/PageHeader";
import { ExportCsvButton } from "@/components/reports/ExportCsvButton";
import { SalesChartPanel } from "@/components/reports/SalesChartPanel";
import { DataTable } from "@/components/ui/DataTable";
import { getDailySalesReport } from "@/lib/queries/reports";

export default async function SalesReportPage() {
  const data = await getDailySalesReport();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Reports"
        title="Daily Sales"
        description="Review daily transaction volume and revenue performance."
        action={<ExportCsvButton filename="daily-sales-report.csv" rows={data} />}
      />

      <SalesChartPanel data={data} />

      <DataTable
        rows={data}
        columns={[
          { key: "date", header: "Date", render: (row) => row.date },
          {
            key: "transactions",
            header: "Transactions",
            render: (row) => row.transactions,
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
