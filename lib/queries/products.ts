import { productRecords, products as mockProducts } from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProductFormValues, ProductRecord, ProductRow, ProductStatus } from "@/types";

function getRelationName(
  relation: { name?: string } | { name?: string }[] | null | undefined
) {
  if (Array.isArray(relation)) {
    return relation[0]?.name;
  }

  return relation?.name;
}

export type ProductFilters = {
  search?: string;
  category?: string;
  brand?: string;
  stockStatus?: "healthy" | "low" | "out";
};

function slugifyProductId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function deriveStatus(stock: number, reorderLevel: number): ProductStatus {
  if (stock <= 0) {
    return "Out";
  }

  if (stock <= reorderLevel) {
    return "Low";
  }

  return "Healthy";
}

function formatPHP(amount: number) {
  return `PHP ${new Intl.NumberFormat("en-PH").format(amount)}`;
}

async function resolveLookupId(
  table: "brands" | "categories",
  name: string
): Promise<string> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("name", name)
    .maybeSingle<{ id: string }>();

  if (error || !data) {
    throw new Error(
      `${table === "brands" ? "Brand" : "Category"} "${name}" was not found.`
    );
  }

  return String(data.id);
}

function applyFilters(rows: ProductRow[], filters: ProductFilters) {
  const search = filters.search?.trim().toLowerCase();
  const category = filters.category?.trim().toLowerCase();
  const brand = filters.brand?.trim().toLowerCase();
  const stockStatus = filters.stockStatus?.trim().toLowerCase();

  return rows.filter((row) => {
    if (search && !`${row.name} ${row.sku}`.toLowerCase().includes(search)) {
      return false;
    }

    if (category && row.category.toLowerCase() !== category) {
      return false;
    }

    if (brand && row.brand.toLowerCase() !== brand) {
      return false;
    }

    if (stockStatus && row.status.toLowerCase() !== stockStatus) {
      return false;
    }

    return true;
  });
}

function parseProductFormValues(data: ProductFormValues) {
  return {
    name: data.name.trim(),
    sku: data.sku.trim(),
    brand: data.brand.trim(),
    category: data.category.trim(),
    motorcycleModel: data.motorcycleModel.trim(),
    costPrice: Number(data.costPrice),
    sellingPrice: Number(data.sellingPrice),
    stockQuantity: Number(data.stockQuantity),
    reorderLevel: Number(data.reorderLevel),
  };
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductRow[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return applyFilters(mockProducts, filters);
  }

  const { data } = await supabase
    .from("products")
    .select(
      "id, name, sku, stock_quantity, reorder_level, selling_price, brands(name), categories(name)"
    )
    .eq("is_archived", false)
    .order("name", { ascending: true });

  const rows: ProductRow[] =
    data?.map((row) => ({
      id: String(row.id),
      name: row.name,
      sku: row.sku,
      brand: getRelationName(row.brands) ?? "Unassigned",
      category: getRelationName(row.categories) ?? "Unassigned",
      stock: row.stock_quantity,
      reorderLevel: row.reorder_level,
      price: formatPHP(Number(row.selling_price ?? 0)),
      status: deriveStatus(row.stock_quantity, row.reorder_level),
    })) ?? [];

  return applyFilters(rows, filters);
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return productRecords.find((record) => record.id === id) ?? null;
  }

  const { data } = await supabase
    .from("products")
    .select(
      "id, name, sku, motorcycle_model, cost_price, selling_price, stock_quantity, reorder_level, brands(name), categories(name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    id: String(data.id),
    name: data.name,
    sku: data.sku,
    brand: getRelationName(data.brands) ?? "Unassigned",
    category: getRelationName(data.categories) ?? "Unassigned",
    motorcycleModel: data.motorcycle_model ?? "",
    costPrice: Number(data.cost_price ?? 0),
    sellingPrice: Number(data.selling_price ?? 0),
    stockQuantity: Number(data.stock_quantity ?? 0),
    reorderLevel: Number(data.reorder_level ?? 0),
    status: deriveStatus(Number(data.stock_quantity ?? 0), Number(data.reorder_level ?? 0)),
  };
}

export async function createProduct(data: ProductFormValues): Promise<{ id: string }> {
  const parsed = parseProductFormValues(data);
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const productId = slugifyProductId(`${parsed.sku}-${parsed.name}`);
  const [brandId, categoryId] = await Promise.all([
    resolveLookupId("brands", parsed.brand),
    resolveLookupId("categories", parsed.category),
  ]);

  const { error } = await supabase.from("products").insert({
    id: productId,
    name: parsed.name,
    sku: parsed.sku,
    brand_id: brandId,
    category_id: categoryId,
    motorcycle_model: parsed.motorcycleModel,
    cost_price: parsed.costPrice,
    selling_price: parsed.sellingPrice,
    stock_quantity: parsed.stockQuantity,
    reorder_level: parsed.reorderLevel,
    is_archived: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { id: productId };
}

export async function updateProduct(
  id: string,
  data: ProductFormValues
): Promise<{ id: string }> {
  const parsed = parseProductFormValues(data);
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const [brandId, categoryId] = await Promise.all([
    resolveLookupId("brands", parsed.brand),
    resolveLookupId("categories", parsed.category),
  ]);

  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.name,
      sku: parsed.sku,
      brand_id: brandId,
      category_id: categoryId,
      motorcycle_model: parsed.motorcycleModel,
      cost_price: parsed.costPrice,
      selling_price: parsed.sellingPrice,
      stock_quantity: parsed.stockQuantity,
      reorder_level: parsed.reorderLevel,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}

export async function archiveProduct(id: string): Promise<{ id: string }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const { error } = await supabase
    .from("products")
    .update({ is_archived: true })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}

export function getDefaultProductFormValues(
  product?: ProductRecord | null
): ProductFormValues {
  if (!product) {
    return {
      name: "",
      sku: "",
      brand: "",
      category: "",
      motorcycleModel: "",
      costPrice: "",
      sellingPrice: "",
      stockQuantity: "",
      reorderLevel: "",
    };
  }

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    brand: product.brand,
    category: product.category,
    motorcycleModel: product.motorcycleModel,
    costPrice: String(product.costPrice),
    sellingPrice: String(product.sellingPrice),
    stockQuantity: String(product.stockQuantity),
    reorderLevel: String(product.reorderLevel),
  };
}

export function getRelatedMovementsForProduct(id: string) {
  const product = productRecords.find((record) => record.id === id);

  if (!product) {
    return [];
  }

  return [
    {
      id: `mv-${id}-1`,
      timestamp: "08:42",
      product: product.name,
      type: "sale" as const,
      quantity: "-2",
      note: "Counter transaction",
    },
    {
      id: `mv-${id}-2`,
      timestamp: "08:10",
      product: product.name,
      type: "stock_in" as const,
      quantity: "+6",
      note: "Morning delivery",
    },
  ];
}
