import { productRecords, saleRecords } from "@/lib/mock-data";
import { isMissingRpcError } from "@/lib/queries/rpc";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  SaleFormItem,
  SaleProductOption,
  SaleRecord,
  SaleRow,
} from "@/types";

function getRelationName(
  relation: { name?: string } | { name?: string }[] | null | undefined
) {
  if (Array.isArray(relation)) {
    return relation[0]?.name;
  }

  return relation?.name;
}

export type SalesFilters = {
  customer?: string;
  dateFrom?: string;
  dateTo?: string;
};

function normalizeDateFrom(dateFrom?: string) {
  return dateFrom?.trim() ? `${dateFrom.trim()}T00:00:00` : undefined;
}

function normalizeDateTo(dateTo?: string) {
  return dateTo?.trim() ? `${dateTo.trim()}T23:59:59.999` : undefined;
}

function mapSaleRow(row: {
  id: string;
  createdAt: string;
  customerName: string | null;
  itemCount: number;
  totalAmount: number;
}): SaleRow {
  return {
    id: row.id,
    date: new Date(row.createdAt).toLocaleString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    customer: row.customerName || "Walk-in",
    items: `${row.itemCount} ${row.itemCount === 1 ? "item" : "items"}`,
    total: `PHP ${new Intl.NumberFormat("en-PH").format(row.totalAmount)}`,
  };
}

export async function getSales(filters: SalesFilters = {}): Promise<SaleRow[]> {
  const supabase = await createServerSupabaseClient();
  const dateFrom = normalizeDateFrom(filters.dateFrom);
  const dateTo = normalizeDateTo(filters.dateTo);

  if (!supabase) {
    return saleRecords
      .filter((sale) => {
        if (
          filters.customer &&
          !(sale.customerName || "Walk-in")
            .toLowerCase()
            .includes(filters.customer.toLowerCase())
        ) {
          return false;
        }

        if (dateFrom && sale.createdAt < dateFrom) {
          return false;
        }

        if (dateTo && sale.createdAt > dateTo) {
          return false;
        }

        return true;
      })
      .map((sale) =>
        mapSaleRow({
          id: sale.id,
          createdAt: sale.createdAt,
          customerName: sale.customerName,
          itemCount: sale.items.length,
          totalAmount: sale.totalAmount,
        })
      );
  }

  let query = supabase
    .from("sales")
    .select("id, customer_name, total_amount, created_at, sale_items(count)")
    .order("created_at", { ascending: false });

  if (dateFrom) {
    query = query.gte("created_at", dateFrom);
  }

  if (dateTo) {
    query = query.lte("created_at", dateTo);
  }

  if (filters.customer) {
    query = query.ilike("customer_name", `%${filters.customer}%`);
  }

  const { data } = await query;

  return (
    data?.map((row) =>
      mapSaleRow({
        id: String(row.id),
        createdAt: row.created_at,
        customerName: row.customer_name,
        itemCount: row.sale_items?.[0]?.count ?? 0,
        totalAmount: Number(row.total_amount ?? 0),
      })
    ) ?? []
  );
}

export async function getSaleCatalog(): Promise<SaleProductOption[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return productRecords.map((record) => ({
      id: record.id,
      name: record.name,
      sellingPrice: record.sellingPrice,
      stockQuantity: record.stockQuantity,
    }));
  }

  const { data } = await supabase
    .from("products")
    .select("id, name, selling_price, stock_quantity")
    .eq("is_archived", false)
    .order("name", { ascending: true });

  return (
    data?.map((row) => ({
      id: String(row.id),
      name: row.name,
      sellingPrice: Number(row.selling_price ?? 0),
      stockQuantity: Number(row.stock_quantity ?? 0),
    })) ?? []
  );
}

export async function getSaleById(id: string): Promise<SaleRecord | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return saleRecords.find((sale) => sale.id === id) ?? null;
  }

  const { data: sale } = await supabase
    .from("sales")
    .select("id, customer_name, total_amount, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!sale) {
    return null;
  }

  const { data: items } = await supabase
    .from("sale_items")
    .select("product_id, quantity, unit_price, subtotal, products(name)")
    .eq("sale_id", id);

  return {
    id: String(sale.id),
    customerName: sale.customer_name,
    totalAmount: Number(sale.total_amount ?? 0),
    createdAt: sale.created_at,
    items:
      items?.map((item) => ({
        productId: String(item.product_id),
        productName: getRelationName(item.products) ?? "Unknown product",
        unitPrice: Number(item.unit_price ?? 0),
        quantity: Number(item.quantity ?? 0),
        subtotal: Number(item.subtotal ?? 0),
      })) ?? [],
  };
}

export async function createSale(
  saleData: { customerName?: string | null },
  items: SaleFormItem[]
): Promise<{ id: string }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const { data: rpcSaleId, error: rpcError } = await supabase.rpc("rpc_create_sale", {
    p_customer_name: saleData.customerName || null,
    p_items: items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.subtotal,
    })),
  });

  if (!rpcError && rpcSaleId) {
    return { id: String(rpcSaleId) };
  }

  if (rpcError && !isMissingRpcError(rpcError)) {
    throw new Error(rpcError.message);
  }

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert({
      customer_name: saleData.customerName || null,
      total_amount: totalAmount,
    })
    .select("id")
    .single();

  if (saleError || !sale) {
    throw new Error(saleError?.message || "Unable to create sale.");
  }

  for (const item of items) {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.productId)
      .maybeSingle();

    if (productError || !product) {
      throw new Error(productError?.message || "Product not found.");
    }

    const nextStock = Number(product.stock_quantity ?? 0) - item.quantity;

    if (nextStock < 0) {
      throw new Error(`Insufficient stock for ${item.productName}.`);
    }

    const { error: itemError } = await supabase.from("sale_items").insert({
      sale_id: sale.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.subtotal,
    });

    if (itemError) {
      throw new Error(itemError.message);
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({ stock_quantity: nextStock })
      .eq("id", item.productId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    const { error: movementError } = await supabase.from("stock_movements").insert({
      product_id: item.productId,
      sale_id: sale.id,
      type: "sale",
      quantity: -item.quantity,
      note: `Sale ${sale.id}`,
    });

    if (movementError) {
      throw new Error(movementError.message);
    }
  }

  return { id: String(sale.id) };
}
