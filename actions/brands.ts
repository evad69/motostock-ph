"use server";

import { revalidatePath } from "next/cache";
import { createBrand, deleteBrand, updateBrand } from "@/lib/queries/brands";
import type { ActionResult } from "@/lib/actions/types";

export type BrandActionState = ActionResult<{ id: string; name: string }>;

function readName(formData: FormData) {
  return String(formData.get("name") ?? "").trim();
}

export async function createBrandAction(
  _previousState: BrandActionState,
  formData: FormData
): Promise<BrandActionState> {
  const name = readName(formData);

  if (!name) {
    return { success: false, error: "Brand name is required." };
  }

  try {
    const data = await createBrand(name);
    revalidatePath("/settings/brands");
    revalidatePath("/products/new");
    return { success: true, error: null, data: { id: data.id, name } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to create brand.",
    };
  }
}

export async function updateBrandAction(
  _previousState: BrandActionState,
  formData: FormData
): Promise<BrandActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const name = readName(formData);

  if (!id || !name) {
    return { success: false, error: "Brand id and name are required." };
  }

  try {
    const data = await updateBrand(id, name);
    revalidatePath("/settings/brands");
    revalidatePath("/products/new");
    revalidatePath("/products");
    return { success: true, error: null, data: { id: data.id, name } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to update brand.",
    };
  }
}

export async function deleteBrandAction(
  _previousState: BrandActionState,
  formData: FormData
): Promise<BrandActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const name = readName(formData) || "brand";

  if (!id) {
    return { success: false, error: "Brand id is required." };
  }

  try {
    const data = await deleteBrand(id);
    revalidatePath("/settings/brands");
    revalidatePath("/products/new");
    revalidatePath("/products");
    return { success: true, error: null, data: { id: data.id, name } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to delete brand.",
    };
  }
}
