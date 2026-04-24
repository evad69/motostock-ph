"use server";

import { revalidatePath } from "next/cache";
import {
  createAdjustment,
  createStockIn,
  type StockMutationValues,
} from "@/lib/queries/stockMovements";
import type { ActionResult } from "@/lib/actions/types";

type StockActionData = {
  note: string;
  productId: string;
  quantity: number;
  type: "adjustment" | "stock_in";
};

export type StockActionState = ActionResult<StockActionData>;

function readMutationValues(formData: FormData): StockMutationValues {
  return {
    productId: String(formData.get("productId") ?? "").trim(),
    quantity: Number(formData.get("quantity") ?? 0),
    note: String(formData.get("note") ?? "").trim(),
    supplierId: String(formData.get("supplierId") ?? "").trim() || undefined,
  };
}

function validate(values: StockMutationValues, requirePositive = false) {
  if (!values.productId) {
    return "Product is required.";
  }

  if (!values.note) {
    return "A note is required.";
  }

  if (!Number.isFinite(values.quantity) || values.quantity === 0) {
    return "Quantity must be a non-zero number.";
  }

  if (requirePositive && values.quantity < 0) {
    return "Stock-in quantity must be positive.";
  }

  return null;
}

export async function createStockInAction(
  _previousState: StockActionState,
  formData: FormData
): Promise<StockActionState> {
  const values = readMutationValues(formData);
  const error = validate(values, true);

  if (error) {
    return { success: false, error };
  }

  try {
    await createStockIn(values);
    revalidatePath("/movements");
    revalidatePath("/dashboard");
    revalidatePath("/products");
    revalidatePath(`/products/${values.productId}`);
    return {
      success: true,
      error: null,
      data: {
        note: values.note,
        productId: values.productId,
        quantity: values.quantity,
        type: "stock_in",
      },
    };
  } catch (caughtError) {
    return {
      success: false,
      error:
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to record stock-in.",
    };
  }
}

export async function createAdjustmentAction(
  _previousState: StockActionState,
  formData: FormData
): Promise<StockActionState> {
  const values = readMutationValues(formData);
  const error = validate(values);

  if (error) {
    return { success: false, error };
  }

  try {
    await createAdjustment(values);
    revalidatePath("/movements");
    revalidatePath("/dashboard");
    revalidatePath("/products");
    revalidatePath(`/products/${values.productId}`);
    return {
      success: true,
      error: null,
      data: {
        note: values.note,
        productId: values.productId,
        quantity: values.quantity,
        type: "adjustment",
      },
    };
  } catch (caughtError) {
    return {
      success: false,
      error:
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to record adjustment.",
    };
  }
}
