"use server";

import { revalidatePath } from "next/cache";
import {
  archiveProduct,
  createProduct,
  updateProduct,
} from "@/lib/queries/products";
import type { ActionResult } from "@/lib/actions/types";
import type { ProductFormValues } from "@/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PRODUCT_PHOTO_BUCKET } from "@/lib/supabase/storage";

export type ProductActionState = ActionResult<{ id: string }>;

function slugifyProductId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readProductFormValues(formData: FormData): ProductFormValues {
  return {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    sku: String(formData.get("sku") ?? ""),
    photoUrl: String(formData.get("currentPhotoUrl") ?? ""),
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

async function uploadProductPhoto(file: File, productId: string) {
  if (!file.size) {
    return "";
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Product photo must be an image file.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Product photo must be 5MB or smaller.");
  }

  const extension = file.name.split(".").pop()?.trim().toLowerCase() || "jpg";
  const safeExtension = extension.replace(/[^a-z0-9]+/g, "") || "jpg";
  const path = `${productId}/${Date.now()}.${safeExtension}`;

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_PHOTO_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PRODUCT_PHOTO_BUCKET).getPublicUrl(path);

  return publicUrl;
}

export async function createProductAction(
  _previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const values = readProductFormValues(formData);
  const photo = formData.get("photo");
  const validationError = validateProductForm(values);

  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const productId = slugifyProductId(`${values.sku}-${values.name}`);
    const photoUrl =
      photo instanceof File && photo.size
        ? await uploadProductPhoto(photo, productId)
        : values.photoUrl;
    const data = await createProduct({
      ...values,
      photoUrl,
    });
    revalidatePath("/products");
    revalidatePath(`/products/${data.id}`);
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
  const photo = formData.get("photo");

  if (!productId) {
    return { success: false, error: "Missing product id." };
  }

  const validationError = validateProductForm(values);

  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const photoUrl =
      photo instanceof File && photo.size
        ? await uploadProductPhoto(photo, productId)
        : values.photoUrl;
    const data = await updateProduct(productId, {
      ...values,
      photoUrl,
    });
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
