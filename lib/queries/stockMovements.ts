import { recentMovements as mockMovements } from "@/lib/mock-data";
import { isMissingRpcError } from "@/lib/queries/rpc";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { StockMovementRow, StockMovementType } from "@/types";

function getRelationName(
  relation: { name?: string } | { name?: string }[] | null | undefined
) {
  if (Array.isArray(relation)) {
    return relation[0]?.name;
  }

  return relation?.name;
}

export type MovementFilters = {
  type?: StockMovementType;
  product?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type StockMutationValues = {
  productId: string;
  quantity: number;
  note: string;
  supplierId?: string;
};

function normalizeMovementRow(data: {
  id: string;
  createdAt: string;
  product: string;
  type: string;
  quantity: number | string;
  note?: string | null;
}): StockMovementRow {
  const createdAt = new Date(data.createdAt);

  return {
    id: String(data.id),
    createdAt: data.createdAt,
    date: createdAt.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    timestamp: createdAt.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    product: data.product,
    type:
      data.type === "sale" || data.type === "stock_in" || data.type === "adjustment"
        ? data.type
        : "adjustment",
    quantity: String(data.quantity),
    note: data.note ?? "",
  };
}

function normalizeDateFrom(dateFrom?: string) {
  return dateFrom?.trim() ? `${dateFrom.trim()}T00:00:00` : undefined;
}

function normalizeDateTo(dateTo?: string) {
  return dateTo?.trim() ? `${dateTo.trim()}T23:59:59.999` : undefined;
}

export async function getMovements(
  filters: MovementFilters = {}
): Promise<StockMovementRow[]> {
  const supabase = await createServerSupabaseClient();
  const dateFrom = normalizeDateFrom(filters.dateFrom);
  const dateTo = normalizeDateTo(filters.dateTo);

  if (!supabase) {
    return mockMovements.filter((row) => {
      if (filters.type && row.type !== filters.type) {
        return false;
      }

      if (
        filters.product &&
        !row.product.toLowerCase().includes(filters.product.toLowerCase())
      ) {
        return false;
      }

      if (dateFrom && row.createdAt < dateFrom) {
        return false;
      }

      if (dateTo && row.createdAt > dateTo) {
        return false;
      }

      return true;
    });
  }

  let query = supabase
    .from("stock_movements")
    .select("id, type, quantity, note, created_at, products(name)")
    .order("created_at", { ascending: false });

  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  if (dateFrom) {
    query = query.gte("created_at", dateFrom);
  }

  if (dateTo) {
    query = query.lte("created_at", dateTo);
  }

  const { data } = await query.limit(50);

  return (
    data
      ?.filter((row) => {
        if (
          filters.product &&
          !getRelationName(row.products)
            ?.toLowerCase()
            .includes(filters.product.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .map((row) =>
        normalizeMovementRow({
          id: String(row.id),
          createdAt: row.created_at,
          product: getRelationName(row.products) ?? "Unknown product",
          type: row.type,
          quantity: row.quantity,
          note: row.note,
        })
      ) ?? []
  );
}

export async function createStockIn(
  values: StockMutationValues
): Promise<{ success: true }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const { error: rpcError } = await supabase.rpc("rpc_adjust_stock", {
    p_product_id: values.productId,
    p_delta: values.quantity,
    p_movement_type: "stock_in",
    p_note: values.note,
    p_supplier_id: values.supplierId || null,
    p_sale_id: null,
  });

  if (!rpcError) {
    return { success: true };
  }

  if (!isMissingRpcError(rpcError)) {
    throw new Error(rpcError.message);
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("stock_quantity")
    .eq("id", values.productId)
    .maybeSingle();

  if (productError || !product) {
    throw new Error(productError?.message || "Product not found.");
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({ stock_quantity: Number(product.stock_quantity) + values.quantity })
    .eq("id", values.productId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { error: movementError } = await supabase.from("stock_movements").insert({
    product_id: values.productId,
    type: "stock_in",
    quantity: values.quantity,
    note: values.note,
    supplier_id: values.supplierId || null,
  });

  if (movementError) {
    throw new Error(movementError.message);
  }

  return { success: true };
}

export async function createAdjustment(
  values: StockMutationValues
): Promise<{ success: true }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const { error: rpcError } = await supabase.rpc("rpc_adjust_stock", {
    p_product_id: values.productId,
    p_delta: values.quantity,
    p_movement_type: "adjustment",
    p_note: values.note,
    p_supplier_id: null,
    p_sale_id: null,
  });

  if (!rpcError) {
    return { success: true };
  }

  if (!isMissingRpcError(rpcError)) {
    throw new Error(rpcError.message);
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("stock_quantity")
    .eq("id", values.productId)
    .maybeSingle();

  if (productError || !product) {
    throw new Error(productError?.message || "Product not found.");
  }

  const nextQuantity = Number(product.stock_quantity) + values.quantity;

  if (nextQuantity < 0) {
    throw new Error("Adjustment would reduce stock below zero.");
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({ stock_quantity: nextQuantity })
    .eq("id", values.productId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { error: movementError } = await supabase.from("stock_movements").insert({
    product_id: values.productId,
    type: "adjustment",
    quantity: values.quantity,
    note: values.note,
  });

  if (movementError) {
    throw new Error(movementError.message);
  }

  return { success: true };
}
