"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/queries/categories";
import type { ActionResult } from "@/lib/actions/types";

export type CategoryActionState = ActionResult<{ id: string; name: string }>;

function readName(formData: FormData) {
  return String(formData.get("name") ?? "").trim();
}

export async function createCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const name = readName(formData);

  if (!name) {
    return { success: false, error: "Category name is required." };
  }

  try {
    const data = await createCategory(name);
    revalidatePath("/settings/categories");
    revalidatePath("/products/new");
    return { success: true, error: null, data: { id: data.id, name } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to create category.",
    };
  }
}

export async function updateCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const name = readName(formData);

  if (!id || !name) {
    return { success: false, error: "Category id and name are required." };
  }

  try {
    const data = await updateCategory(id, name);
    revalidatePath("/settings/categories");
    revalidatePath("/products/new");
    revalidatePath("/products");
    return { success: true, error: null, data: { id: data.id, name } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to update category.",
    };
  }
}

export async function deleteCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const name = readName(formData) || "category";

  if (!id) {
    return { success: false, error: "Category id is required." };
  }

  try {
    const data = await deleteCategory(id);
    revalidatePath("/settings/categories");
    revalidatePath("/products/new");
    revalidatePath("/products");
    return { success: true, error: null, data: { id: data.id, name } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to delete category.",
    };
  }
}
