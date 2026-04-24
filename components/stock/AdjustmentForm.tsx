"use client";

import { useActionState, useState } from "react";
import {
  createAdjustmentAction,
  type StockActionState,
} from "@/actions/stockMovements";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useActionToast } from "@/hooks/useActionToast";
import type { ProductRow, ProductStatus } from "@/types";

type InventoryPreview = {
  productId: string;
  productName: string;
  reorderLevel: number;
  status: ProductStatus;
  stockQuantity: number;
};

type AdjustmentFormProps = {
  products: ProductRow[];
  defaultProductId?: string;
  inventory?: InventoryPreview;
};

function deriveStatus(stockQuantity: number, reorderLevel: number): ProductStatus {
  if (stockQuantity <= 0) {
    return "Out";
  }

  if (stockQuantity <= reorderLevel) {
    return "Low";
  }

  return "Healthy";
}

function applyInventoryPreview(current: InventoryPreview, quantity: number): InventoryPreview {
  const nextStockQuantity = current.stockQuantity + quantity;

  return {
    ...current,
    status: deriveStatus(nextStockQuantity, current.reorderLevel),
    stockQuantity: nextStockQuantity,
  };
}

export function AdjustmentForm({
  products,
  defaultProductId,
  inventory,
}: AdjustmentFormProps) {
  const initialState: StockActionState = { success: false, error: null };
  const [state, formAction, pending] = useActionState<StockActionState, FormData>(
    createAdjustmentAction,
    initialState
  );
  const [optimisticQuantity, setOptimisticQuantity] = useState<number | null>(
    null
  );
  const projectedInventory =
    inventory && optimisticQuantity !== null
      ? applyInventoryPreview(inventory, optimisticQuantity)
      : inventory ?? null;
  const lockedProduct = defaultProductId
    ? products.find((product) => product.id === defaultProductId)
    : undefined;

  useActionToast(state, {
    successTitle: "Adjustment recorded",
    successDescription: "Stock quantity and movement history were updated.",
    errorTitle: "Adjustment failed",
  });

  const submitAction = async (formData: FormData) => {
    const productId = String(formData.get("productId") ?? defaultProductId ?? "").trim();
    const quantity = Number(formData.get("quantity") ?? 0);
    const note = String(formData.get("note") ?? "").trim();

    const canApplyOptimisticUpdate =
      inventory &&
      productId === inventory.productId &&
      note.length > 0 &&
      Number.isFinite(quantity) &&
      quantity !== 0 &&
      inventory.stockQuantity + quantity >= 0;

    if (canApplyOptimisticUpdate) {
      setOptimisticQuantity(quantity);
    }

    await formAction(formData);
    setOptimisticQuantity(null);
  };

  return (
    <form action={submitAction} className="grid gap-4 border-t border-[var(--color-line)] pt-5">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
        Adjustment
      </p>
      {lockedProduct ? (
        <FormField label="Product">
          <input type="hidden" name="productId" value={lockedProduct.id} />
          <div className="flex min-h-12 items-center border-b border-[var(--color-line)] py-3">
            {lockedProduct.name}
          </div>
        </FormField>
      ) : (
        <FormField label="Product">
          <select
            name="productId"
            defaultValue={defaultProductId ?? ""}
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </FormField>
      )}
      <FormField label="Quantity delta" hint="Use negative values for loss or damage.">
        <input
          name="quantity"
          type="number"
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
        />
      </FormField>
      <FormField label="Reason / note" hint="Required for adjustments.">
        <textarea
          name="note"
          className="min-h-24 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
        />
      </FormField>
      {projectedInventory ? (
        <div className="grid gap-4 border-b border-[rgba(17,22,29,0.08)] pb-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--color-muted)]">
              Projected Stock
            </p>
            <p className="text-lg font-medium">{projectedInventory.stockQuantity}</p>
          </div>
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--color-muted)]">
              Projected Status
            </p>
            <StatusBadge
              tone={
                projectedInventory.status === "Healthy"
                  ? "success"
                  : projectedInventory.status === "Low"
                    ? "warning"
                    : "danger"
              }
            >
              {projectedInventory.status}
            </StatusBadge>
          </div>
        </div>
      ) : null}
      {state.error ? (
        <p className="text-sm leading-7 text-[var(--color-danger)]">{state.error}</p>
      ) : null}
      <button type="submit" className="button-primary w-fit" disabled={pending}>
        {pending ? "Saving..." : "Record Adjustment"}
      </button>
    </form>
  );
}
