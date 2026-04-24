"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createProductAction,
  updateProductAction,
  type ProductActionState,
} from "@/actions/products";
import { FormField } from "@/components/ui/FormField";
import { useActionToast } from "@/hooks/useActionToast";
import type { LookupItem, ProductFormValues } from "@/types";

type ProductFormProps = {
  mode: "create" | "edit";
  initialValues: ProductFormValues;
  brands: LookupItem[];
  categories: LookupItem[];
};

export function ProductForm({
  mode,
  initialValues,
  brands,
  categories,
}: ProductFormProps) {
  const action = mode === "create" ? createProductAction : updateProductAction;
  const initialProductActionState: ProductActionState = {
    success: false,
    error: null,
  };
  const [state, formAction, pending] = useActionState<ProductActionState, FormData>(
    action,
    initialProductActionState
  );
  useActionToast(state, {
    successTitle: mode === "create" ? "Product created" : "Product updated",
    successDescription:
      mode === "create"
        ? "The product record is now available in the catalog."
        : "The product changes were saved.",
    errorTitle: mode === "create" ? "Product creation failed" : "Product update failed",
  });

  return (
    <form action={formAction} className="grid gap-8">
      {initialValues.id ? <input type="hidden" name="id" value={initialValues.id} /> : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <FormField label="Part name">
          <input
            name="name"
            defaultValue={initialValues.name}
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
        </FormField>
        <FormField label="SKU / item code">
          <input
            name="sku"
            defaultValue={initialValues.sku}
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
        </FormField>
        <FormField
          label="Product photo URL"
          hint="Paste a direct image link to show the product photo on its detail page."
        >
          <input
            type="url"
            name="photoUrl"
            defaultValue={initialValues.photoUrl}
            placeholder="https://..."
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
        </FormField>
        <FormField label="Brand">
          <input
            list="brand-options"
            name="brand"
            defaultValue={initialValues.brand}
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
          <datalist id="brand-options">
            {brands.map((brand) => (
              <option key={brand.id} value={brand.name} />
            ))}
          </datalist>
        </FormField>
        <FormField label="Category">
          <input
            list="category-options"
            name="category"
            defaultValue={initialValues.category}
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category.id} value={category.name} />
            ))}
          </datalist>
        </FormField>
        <FormField label="Compatible motorcycle model">
          <input
            name="motorcycleModel"
            defaultValue={initialValues.motorcycleModel}
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
        </FormField>
        <FormField label="Cost price">
          <input
            name="costPrice"
            defaultValue={initialValues.costPrice}
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
        </FormField>
        <FormField label="Selling price">
          <input
            name="sellingPrice"
            defaultValue={initialValues.sellingPrice}
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
        </FormField>
        <FormField label="Stock quantity">
          <input
            name="stockQuantity"
            defaultValue={initialValues.stockQuantity}
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
        </FormField>
        <FormField label="Reorder level">
          <input
            name="reorderLevel"
            defaultValue={initialValues.reorderLevel}
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
        </FormField>
      </div>

      {state.error ? (
        <p className="text-sm leading-7 text-[var(--color-danger)]">{state.error}</p>
      ) : null}

      {state.success && state.data?.id ? (
        <p className="text-sm leading-7 text-[var(--color-success)]">
          Product saved. View it at{" "}
          <Link href={`/products/${state.data.id}`} className="underline underline-offset-4">
            /products/{state.data.id}
          </Link>
          .
        </p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row">
        <button type="submit" className="button-primary" disabled={pending}>
          {pending
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create Product"
              : "Save Changes"}
        </button>
        <Link href="/products" className="button-secondary">
          Back to Products
        </Link>
      </div>
    </form>
  );
}
