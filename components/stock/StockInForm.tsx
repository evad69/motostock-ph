"use client";

import { useActionState } from "react";
import {
  createStockInAction,
  type StockActionState,
} from "@/actions/stockMovements";
import { FormField } from "@/components/ui/FormField";
import { useActionToast } from "@/hooks/useActionToast";
import type { ProductRow } from "@/types";

type StockInFormProps = {
  products: ProductRow[];
  defaultProductId?: string;
};

export function StockInForm({ products, defaultProductId }: StockInFormProps) {
  const initialState: StockActionState = { success: false, error: null };
  const [state, formAction, pending] = useActionState<StockActionState, FormData>(
    createStockInAction,
    initialState
  );
  useActionToast(state, {
    successTitle: "Stock-in recorded",
    successDescription: "Inventory and movement history were updated.",
    errorTitle: "Stock-in failed",
  });

  return (
    <form action={formAction} className="grid gap-4 border-t border-[var(--color-line)] pt-5">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
        Stock In
      </p>
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
      <FormField label="Quantity">
        <input
          name="quantity"
          type="number"
          min="1"
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
        />
      </FormField>
      <FormField label="Supplier (optional)">
        <input
          name="supplierId"
          placeholder="Supplier id or leave blank"
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none placeholder:text-[color:var(--color-muted)] focus:border-[var(--color-accent)]"
        />
      </FormField>
      <FormField label="Note">
        <textarea
          name="note"
          className="min-h-24 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
        />
      </FormField>
      {state.error ? (
        <p className="text-sm leading-7 text-[var(--color-danger)]">{state.error}</p>
      ) : null}
      <button type="submit" className="button-primary w-fit" disabled={pending}>
        {pending ? "Saving..." : "Record Stock In"}
      </button>
    </form>
  );
}
