import {
  dashboardMetrics as mockMetrics,
  lowStockItems as mockLowStockItems,
  products as mockProducts,
  recentMovements as mockMovements,
  sales as mockSales,
} from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DashboardMetric, StockMovementRow } from "@/types";

function getRelationName(
  relation: { name?: string } | { name?: string }[] | null | undefined
) {
  if (Array.isArray(relation)) {
    return relation[0]?.name;
  }

  return relation?.name;
}

export async function getTotalProducts(): Promise<number> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return mockProducts.length;
  }

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_archived", false);

  return count ?? 0;
}

export async function getLowStockCount(): Promise<number> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return mockProducts.filter((item) => item.stock <= item.reorderLevel).length;
  }

  const { data } = await supabase
    .from("products")
    .select("stock_quantity, reorder_level")
    .eq("is_archived", false);

  return (
    data?.filter((item) => item.stock_quantity <= item.reorder_level).length ?? 0
  );
}

export async function getOutOfStockCount(): Promise<number> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return mockProducts.filter((item) => item.stock === 0).length;
  }

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_archived", false)
    .eq("stock_quantity", 0);

  return count ?? 0;
}

export async function getTodaySales(): Promise<number> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return 18460;
  }

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    .toISOString();
  const { data } = await supabase
    .from("sales")
    .select("total_amount")
    .gte("created_at", start);

  return data?.reduce((sum, item) => sum + Number(item.total_amount ?? 0), 0) ?? 0;
}

export async function getRecentMovements(limit = 10): Promise<StockMovementRow[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return mockMovements.slice(0, limit);
  }

  const { data } = await supabase
    .from("stock_movements")
    .select("id, type, quantity, note, created_at, products(name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!data) {
    return [];
  }

  return data.map((row) => ({
    id: String(row.id),
    createdAt: row.created_at,
    date: new Date(row.created_at).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    timestamp: new Date(row.created_at).toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    product: getRelationName(row.products) ?? "Unknown product",
    type:
      row.type === "sale" || row.type === "stock_in" || row.type === "adjustment"
        ? row.type
        : "adjustment",
    quantity: String(row.quantity),
    note: row.note ?? "",
  }));
}

export async function getDashboardMetrics(): Promise<DashboardMetric[]> {
  const [totalProducts, lowStockCount, outOfStockCount, todaySales] =
    await Promise.all([
      getTotalProducts(),
      getLowStockCount(),
      getOutOfStockCount(),
      getTodaySales(),
    ]);

  return [
    {
      label: "Total Products",
      value: new Intl.NumberFormat("en-PH").format(totalProducts),
      hint: mockMetrics[0]?.hint ?? "",
    },
    {
      label: "Low Stock",
      value: new Intl.NumberFormat("en-PH").format(lowStockCount),
      hint: mockMetrics[1]?.hint ?? "",
    },
    {
      label: "Out of Stock",
      value: new Intl.NumberFormat("en-PH").format(outOfStockCount),
      hint: mockMetrics[2]?.hint ?? "",
    },
    {
      label: "Today's Sales",
      value: `PHP ${new Intl.NumberFormat("en-PH").format(todaySales)}`,
      hint: mockMetrics[3]?.hint ?? `${mockSales.length} transactions processed`,
      accent: todaySales > 0,
    },
  ];
}

export async function getLowStockItems(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return mockLowStockItems;
  }

  const { data } = await supabase
    .from("products")
    .select("name, stock_quantity, reorder_level")
    .eq("is_archived", false);

  return (
    data
      ?.filter((item) => item.stock_quantity <= item.reorder_level)
      .map((item) => `${item.name} - ${item.stock_quantity} left`) ?? []
  );
}
