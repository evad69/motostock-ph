import {
  dailySalesReport as mockDailySalesReport,
  inventoryValuationReport as mockInventoryValuationReport,
  lowStockReport as mockLowStockReport,
  reportHighlights as mockHighlights,
  topSellingPartsReport as mockTopSellingPartsReport,
} from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  DailySalesReportRow,
  InventoryValuationRow,
  LowStockReportRow,
  ReportHighlight,
  TopSellingPartRow,
} from "@/types";

function getRelationName(
  relation: { name?: string } | { name?: string }[] | null | undefined
) {
  if (Array.isArray(relation)) {
    return relation[0]?.name;
  }

  return relation?.name;
}

export async function getDailySalesReport(): Promise<DailySalesReportRow[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return mockDailySalesReport;
  }

  const { data } = await supabase
    .from("sales")
    .select("created_at, total_amount")
    .order("created_at", { ascending: true });

  const buckets = new Map<string, DailySalesReportRow>();

  data?.forEach((row) => {
    const dateKey = new Date(row.created_at).toLocaleDateString("en-PH", {
      month: "short",
      day: "2-digit",
    });
    const existing = buckets.get(dateKey) ?? {
      date: dateKey,
      transactions: 0,
      revenue: 0,
    };

    existing.transactions += 1;
    existing.revenue += Number(row.total_amount ?? 0);
    buckets.set(dateKey, existing);
  });

  return Array.from(buckets.values());
}

export async function getTopSellingParts(
  dateRange: { from?: string; to?: string } | undefined = undefined,
  limit = 10
): Promise<TopSellingPartRow[]> {
  void dateRange;
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return mockTopSellingPartsReport.slice(0, limit);
  }

  const { data } = await supabase
    .from("sale_items")
    .select("quantity, subtotal, products(name)")
    .limit(200);

  const buckets = new Map<string, TopSellingPartRow>();

  data?.forEach((row) => {
    const productName = getRelationName(row.products) ?? "Unknown product";
    const existing = buckets.get(productName) ?? {
      productName,
      quantitySold: 0,
      revenue: 0,
    };

    existing.quantitySold += Number(row.quantity ?? 0);
    existing.revenue += Number(row.subtotal ?? 0);
    buckets.set(productName, existing);
  });

  return Array.from(buckets.values())
    .sort((left, right) => right.quantitySold - left.quantitySold)
    .slice(0, limit);
}

export async function getLowStockReport(): Promise<LowStockReportRow[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return mockLowStockReport;
  }

  const { data } = await supabase
    .from("products")
    .select("id, name, stock_quantity, reorder_level, brands(name), categories(name)")
    .eq("is_archived", false);

  return (
    data
      ?.filter((row) => Number(row.stock_quantity ?? 0) <= Number(row.reorder_level ?? 0))
      .map((row) => ({
        productId: String(row.id),
        productName: row.name,
        category: getRelationName(row.categories) ?? "Unassigned",
        brand: getRelationName(row.brands) ?? "Unassigned",
        stockQuantity: Number(row.stock_quantity ?? 0),
        reorderLevel: Number(row.reorder_level ?? 0),
      })) ?? []
  );
}

export async function getInventoryValuation(): Promise<InventoryValuationRow[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return mockInventoryValuationReport;
  }

  const { data } = await supabase
    .from("products")
    .select("id, name, cost_price, stock_quantity, brands(name), categories(name)")
    .eq("is_archived", false);

  return (
    data?.map((row) => ({
      productId: String(row.id),
      productName: row.name,
      category: getRelationName(row.categories) ?? "Unassigned",
      brand: getRelationName(row.brands) ?? "Unassigned",
      costPrice: Number(row.cost_price ?? 0),
      stockQuantity: Number(row.stock_quantity ?? 0),
      totalValue: Number(row.cost_price ?? 0) * Number(row.stock_quantity ?? 0),
    })) ?? []
  );
}

export async function getReportHighlights(): Promise<ReportHighlight[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return mockHighlights;
  }

  const [salesReport, topParts, valuation] = await Promise.all([
    getDailySalesReport(),
    getTopSellingParts(undefined, 1),
    getInventoryValuation(),
  ]);

  const totalRevenue = salesReport.reduce((sum, row) => sum + row.revenue, 0);
  const totalTransactions = salesReport.reduce((sum, row) => sum + row.transactions, 0);
  const averageRevenue =
    salesReport.length > 0 ? Math.round(totalRevenue / salesReport.length) : 0;
  const totalValuation = valuation.reduce((sum, row) => sum + row.totalValue, 0);

  return [
    {
      title: "Top-Selling Parts",
      value: topParts[0]?.productName ?? "No sales yet",
      detail: `${topParts[0]?.quantitySold ?? 0} units sold`,
    },
    {
      title: "Inventory Valuation",
      value: `PHP ${new Intl.NumberFormat("en-PH").format(totalValuation)}`,
      detail: "Based on cost price x on-hand stock",
    },
    {
      title: "Daily Revenue Avg.",
      value: `PHP ${new Intl.NumberFormat("en-PH").format(averageRevenue)}`,
      detail: `${totalTransactions} transactions in current snapshot`,
    },
  ];
}
