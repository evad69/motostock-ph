"use server";

import { revalidatePath } from "next/cache";
import { archiveProduct, createProduct, updateProduct } from "@/lib/queries/products";
import type { ActionResult } from "@/lib/actions/types";
import type { ProductFormValues } from "@/types";

export type ProductActionState = ActionResult<{ id: string }>;

function readProductFormValues(formData: FormData): ProductFormValues {
  return {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    sku: String(formData.get("sku") ?? ""),
    brand: String(formData.get("brand") ?? ""),
    category: String(formData.get("category") ?? ""),
    motorcycleModel: String(formData.get("motorcycleModel") ?? ""),
    costPrice: String(formData.get("costPrice") ?? ""),
    sellingPrice: String(formData.get("sellingPrice") ?? ""),
    stockQuantity: String(formData.get("stockQuantity") ?? ""),
    reorderLevel: String(formData.get("reorderLevel") ?? ""),
  };
}

function validateProductForm(values: ProductFormValues) {
  if (!values.name.trim() || !values.sku.trim()) {
    return "Part name and SKU are required.";
  }

  if (
    !values.brand.trim() ||
    !values.category.trim() ||
    !values.motorcycleModel.trim()
  ) {
    return "Brand, category, and motorcycle model are required.";
  }

  if (
    Number.isNaN(Number(values.costPrice)) ||
    Number.isNaN(Number(values.sellingPrice)) ||
    Number.isNaN(Number(values.stockQuantity)) ||
    Number.isNaN(Number(values.reorderLevel))
  ) {
    return "Pricing and stock fields must contain valid numbers.";
  }

  return null;
}

export async function createProductAction(
  _previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const values = readProductFormValues(formData);
  const validationError = validateProductForm(values);

  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const data = await createProduct(values);
    revalidatePath("/products");
    return { success: true, error: null, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to create product.",
    };
  }
}

export async function updateProductAction(
  _previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const values = readProductFormValues(formData);
  const productId = values.id?.trim();

  if (!productId) {
    return { success: false, error: "Missing product id." };
  }

  const validationError = validateProductForm(values);

  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const data = await updateProduct(productId, values);
    revalidatePath("/products");
    revalidatePath(`/products/${productId}`);
    return { success: true, error: null, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to update product.",
    };
  }
}

export async function archiveProductAction(
  _previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    return { success: false, error: "Missing product id." };
  }

  try {
    const data = await archiveProduct(id);
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    return { success: true, error: null, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to archive product.",
    };
  }
}
