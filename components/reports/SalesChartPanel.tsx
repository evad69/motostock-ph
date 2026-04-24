"use client";

import dynamic from "next/dynamic";
import type { DailySalesReportRow } from "@/types";

const SalesBarChart = dynamic(
  () => import("@/components/charts/SalesBarChart").then((mod) => mod.SalesBarChart),
  { ssr: false }
);

type SalesChartPanelProps = {
  data: DailySalesReportRow[];
};

export function SalesChartPanel({ data }: SalesChartPanelProps) {
  return <SalesBarChart data={data} />;
}
