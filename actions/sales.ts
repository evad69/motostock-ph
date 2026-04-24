"use server";

import { revalidatePath } from "next/cache";
import { createSale } from "@/lib/queries/sales";
import type { ActionResult, RedirectActionData } from "@/lib/actions/types";
import type { SaleFormItem } from "@/types";

type SaleActionData = RedirectActionData & {
  customerName: string | null;
  id: string;
  itemCount: number;
  totalAmount: number;
};

export type SaleActionState = ActionResult<SaleActionData>;

export async function createSaleAction(
  _previousState: SaleActionState,
  formData: FormData
): Promise<SaleActionState> {
  const customerName = String(formData.get("customerName") ?? "").trim();
  const itemsRaw = String(formData.get("items") ?? "[]");

  let items: SaleFormItem[];

  try {
    items = JSON.parse(itemsRaw) as SaleFormItem[];
  } catch {
    return { success: false, error: "Unable to read sale items." };
  }

  if (!items.length) {
    return { success: false, error: "Add at least one line item." };
  }

  if (
    items.some(
      (item) =>
        !item.productId ||
        !item.productName ||
        item.quantity <= 0 ||
        item.unitPrice < 0 ||
        item.subtotal <= 0
    )
  ) {
    return { success: false, error: "Each sale item must be complete and valid." };
  }

  try {
    const sale = await createSale({ customerName }, items);
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    revalidatePath("/sales");
    revalidatePath(`/sales/${sale.id}`);
    revalidatePath("/dashboard");
    revalidatePath("/movements");
    revalidatePath("/products");
    return {
      success: true,
      error: null,
      data: {
        customerName: customerName || null,
        id: sale.id,
        itemCount: items.length,
        redirectTo: `/sales/${sale.id}`,
        totalAmount,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to create sale.",
    };
  }
}
