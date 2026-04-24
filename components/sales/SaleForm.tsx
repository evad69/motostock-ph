"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { createSaleAction, type SaleActionState } from "@/actions/sales";
import { FormField } from "@/components/ui/FormField";
import { useActionToast } from "@/hooks/useActionToast";
import type { SaleFormItem, SaleProductOption } from "@/types";

type SaleFormProps = {
  products: SaleProductOption[];
};

function createEmptyItem(): SaleFormItem {
  return {
    productId: "",
    productName: "",
    unitPrice: 0,
    quantity: 1,
    subtotal: 0,
  };
}

type PendingSalePreview = {
  customerName: string;
  items: SaleFormItem[];
  total: number;
  visible: boolean;
};

const EMPTY_PENDING_SALE: PendingSalePreview = {
  customerName: "",
  items: [],
  total: 0,
  visible: false,
};

function buildPendingSalePreview(
  customerName: string,
  items: SaleFormItem[]
): PendingSalePreview {
  return {
    customerName: customerName || "Walk-in",
    items: items.map((item) => ({ ...item })),
    total: items.reduce((sum, item) => sum + item.subtotal, 0),
    visible: true,
  };
}

export function SaleForm({ products }: SaleFormProps) {
  const router = useRouter();
  const initialState: SaleActionState = { success: false, error: null };
  const [state, formAction, pending] = useActionState<SaleActionState, FormData>(
    createSaleAction,
    initialState
  );
  useActionToast(state, {
    errorTitle: "Sale creation failed",
  });
  const [items, setItems] = useState<SaleFormItem[]>([createEmptyItem()]);
  const [pendingSalePreview, setPendingSalePreview] = useState<PendingSalePreview>(
    EMPTY_PENDING_SALE
  );

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  useEffect(() => {
    if (state.success && state.data?.redirectTo) {
      router.replace(state.data.redirectTo);
      router.refresh();
    }
  }, [router, state.data?.redirectTo, state.success]);

  const submitAction = async (formData: FormData) => {
    const customerName = String(formData.get("customerName") ?? "").trim();
    setPendingSalePreview(buildPendingSalePreview(customerName, items));
    await formAction(formData);
    setPendingSalePreview({ ...EMPTY_PENDING_SALE });
  };

  return (
    <form action={submitAction} className="grid gap-8">
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <FormField label="Customer name" hint="Optional">
        <input
          name="customerName"
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
        />
      </FormField>

      <div className="grid gap-4 border-t border-[var(--color-line)] pt-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid gap-4 border-b border-[rgba(17,22,29,0.08)] pb-5 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr_auto]"
          >
            <FormField label="Product">
              <select
                value={item.productId}
                onChange={(event) => {
                  const selected = products.find(
                    (product) => product.id === event.target.value
                  );

                  setItems((current) =>
                    current.map((currentItem, currentIndex) =>
                      currentIndex === index
                        ? {
                            ...currentItem,
                            productId: selected?.id ?? "",
                            productName: selected?.name ?? "",
                            unitPrice: selected?.sellingPrice ?? 0,
                            subtotal: (selected?.sellingPrice ?? 0) * currentItem.quantity,
                          }
                        : currentItem
                    )
                  );
                }}
                className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - PHP {product.sellingPrice}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Price">
              <input
                value={item.unitPrice}
                readOnly
                className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none"
              />
            </FormField>

            <FormField label="Quantity">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(event) => {
                  const quantity = Number(event.target.value || 1);

                  setItems((current) =>
                    current.map((currentItem, currentIndex) =>
                      currentIndex === index
                        ? {
                            ...currentItem,
                            quantity,
                            subtotal: currentItem.unitPrice * quantity,
                          }
                        : currentItem
                    )
                  );
                }}
                className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
              />
            </FormField>

            <FormField label="Subtotal">
              <input
                value={item.subtotal}
                readOnly
                className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none"
              />
            </FormField>

            <div className="flex items-end md:col-span-2 lg:col-span-1">
              <button
                type="button"
                className="button-secondary w-full lg:w-auto"
                onClick={() =>
                  setItems((current) =>
                    current.length === 1
                      ? [createEmptyItem()]
                      : current.filter((_, currentIndex) => currentIndex !== index)
                  )
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="button-secondary w-full sm:w-fit"
          onClick={() => setItems((current) => [...current, createEmptyItem()])}
        >
          Add Line Item
        </button>
        <p className="font-display text-3xl uppercase tracking-[-0.05em]">
          Total: PHP {total}
        </p>
      </div>

      {pendingSalePreview.visible ? (
        <section className="grid gap-4 border-t border-[var(--color-line)] pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
                Pending Sale
              </p>
              <p className="text-sm leading-7 text-[color:var(--color-muted)]">
                Posting {pendingSalePreview.items.length} line
                {pendingSalePreview.items.length === 1 ? "" : "s"} for{" "}
                {pendingSalePreview.customerName}.
              </p>
            </div>
            <p className="font-display text-3xl uppercase tracking-[-0.05em]">
              PHP {pendingSalePreview.total}
            </p>
          </div>

          <div className="grid gap-3">
            {pendingSalePreview.items.map((item, index) => (
              <div
                key={`${item.productId}-${index}`}
                className="flex items-center justify-between gap-4 border-b border-[rgba(17,22,29,0.08)] pb-3 text-sm"
              >
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-[color:var(--color-muted)]">
                    {item.quantity} x PHP {item.unitPrice}
                  </p>
                </div>
                <p>PHP {item.subtotal}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {state.error ? (
        <p className="text-sm leading-7 text-[var(--color-danger)]">{state.error}</p>
      ) : null}

      <button type="submit" className="button-primary w-full sm:w-fit" disabled={pending}>
        {pending ? "Saving Sale..." : "Create Sale"}
      </button>
    </form>
  );
}
