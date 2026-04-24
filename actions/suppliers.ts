"use server";

import { revalidatePath } from "next/cache";
import {
  createSupplier,
  deleteSupplier,
  updateSupplier,
} from "@/lib/queries/suppliers";
import type { ActionResult, RedirectActionData } from "@/lib/actions/types";
import type { SupplierFormValues } from "@/types";

export type SupplierActionState = ActionResult<{ id: string }>;
export type SupplierDeleteActionState = ActionResult<
  RedirectActionData & { id: string }
>;

function readSupplierFormValues(formData: FormData): SupplierFormValues {
  return {
    id: String(formData.get("id") ?? "").trim() || undefined,
    name: String(formData.get("name") ?? "").trim(),
    contactNumber: String(formData.get("contactNumber") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  };
}

function validate(values: SupplierFormValues) {
  if (!values.name) {
    return "Supplier name is required.";
  }

  if (!values.contactNumber || !values.address) {
    return "Contact number and address are required.";
  }

  return null;
}

export async function createSupplierAction(
  _previousState: SupplierActionState,
  formData: FormData
): Promise<SupplierActionState> {
  const values = readSupplierFormValues(formData);
  const error = validate(values);

  if (error) {
    return { success: false, error };
  }

  try {
    const data = await createSupplier(values);
    revalidatePath("/suppliers");
    return { success: true, error: null, data };
  } catch (caughtError) {
    return {
      success: false,
      error:
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create supplier.",
    };
  }
}

export async function updateSupplierAction(
  _previousState: SupplierActionState,
  formData: FormData
): Promise<SupplierActionState> {
  const values = readSupplierFormValues(formData);
  const id = values.id;

  if (!id) {
    return { success: false, error: "Missing supplier id." };
  }

  const error = validate(values);

  if (error) {
    return { success: false, error };
  }

  try {
    const data = await updateSupplier(id, values);
    revalidatePath("/suppliers");
    revalidatePath(`/suppliers/${id}`);
    return { success: true, error: null, data };
  } catch (caughtError) {
    return {
      success: false,
      error:
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to update supplier.",
    };
  }
}

export async function deleteSupplierAction(
  _previousState: SupplierDeleteActionState,
  formData: FormData
): Promise<SupplierDeleteActionState> {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    return { success: false, error: "Missing supplier id." };
  }

  try {
    const data = await deleteSupplier(id);
    revalidatePath("/suppliers");
    revalidatePath(`/suppliers/${id}`);
    return {
      success: true,
      error: null,
      data: {
        id: data.id,
        redirectTo: "/suppliers",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to delete supplier.",
    };
  }
}
