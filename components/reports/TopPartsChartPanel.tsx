"use client";

import dynamic from "next/dynamic";
import type { TopSellingPartRow } from "@/types";

const TopPartsChart = dynamic(
  () => import("@/components/charts/TopPartsChart").then((mod) => mod.TopPartsChart),
  { ssr: false }
);

type TopPartsChartPanelProps = {
  data: TopSellingPartRow[];
};

export function TopPartsChartPanel({ data }: TopPartsChartPanelProps) {
  return <TopPartsChart data={data} />;
}
