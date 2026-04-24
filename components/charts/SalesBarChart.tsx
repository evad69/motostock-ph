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
import type { DailySalesReportRow } from "@/types";

type SalesBarChartProps = {
  data: DailySalesReportRow[];
};

export function SalesBarChart({ data }: SalesBarChartProps) {
  return (
    <div
      className="h-80 min-w-0 w-full border-t border-[var(--color-line)] pt-5"
      aria-label="Daily sales bar chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(17,22,29,0.08)" vertical={false} />
          <XAxis dataKey="date" stroke="var(--color-muted)" tickLine={false} axisLine={false} />
          <YAxis stroke="var(--color-muted)" tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--color-canvas)",
              border: "1px solid var(--color-line)",
            }}
          />
          <Bar dataKey="revenue" fill="var(--color-accent)" radius={[0, 0, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
