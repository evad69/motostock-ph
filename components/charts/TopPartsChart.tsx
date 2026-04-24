"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TopSellingPartRow } from "@/types";

type TopPartsChartProps = {
  data: TopSellingPartRow[];
};

export function TopPartsChart({ data }: TopPartsChartProps) {
  return (
    <div
      className="h-96 min-w-0 w-full border-t border-[var(--color-line)] pt-5"
      aria-label="Top selling parts horizontal bar chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid stroke="rgba(17,22,29,0.08)" horizontal={false} />
          <XAxis type="number" stroke="var(--color-muted)" tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="productName"
            width={160}
            stroke="var(--color-muted)"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-canvas)",
              border: "1px solid var(--color-line)",
            }}
          />
          <Bar dataKey="quantitySold" fill="var(--color-accent-strong)" radius={[0, 0, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
