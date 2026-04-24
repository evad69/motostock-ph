"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createSupplierAction,
  updateSupplierAction,
  type SupplierActionState,
} from "@/actions/suppliers";
import { FormField } from "@/components/ui/FormField";
import { useActionToast } from "@/hooks/useActionToast";
import type { SupplierFormValues } from "@/types";

type SupplierFormProps = {
  mode: "create" | "edit";
  initialValues: SupplierFormValues;
};

export function SupplierForm({ mode, initialValues }: SupplierFormProps) {
  const action = mode === "create" ? createSupplierAction : updateSupplierAction;
  const initialState: SupplierActionState = { success: false, error: null };
  const [state, formAction, pending] = useActionState<SupplierActionState, FormData>(
    action,
    initialState
  );
  useActionToast(state, {
    successTitle: mode === "create" ? "Supplier created" : "Supplier updated",
    successDescription:
      mode === "create"
        ? "The supplier is now available for stock-in records."
        : "Supplier changes were saved.",
    errorTitle: mode === "create" ? "Supplier creation failed" : "Supplier update failed",
  });

  return (
    <form action={formAction} className="grid gap-8">
      {initialValues.id ? <input type="hidden" name="id" value={initialValues.id} /> : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <FormField label="Supplier name">
          <input
            name="name"
            defaultValue={initialValues.name}
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
        </FormField>
        <FormField label="Contact number">
          <input
            name="contactNumber"
            defaultValue={initialValues.contactNumber}
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
        </FormField>
        <FormField label="Address">
          <input
            name="address"
            defaultValue={initialValues.address}
            className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
        </FormField>
        <FormField label="Notes">
          <textarea
            name="notes"
            defaultValue={initialValues.notes}
            className="min-h-28 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
          />
        </FormField>
      </div>

      {state.error ? (
        <p className="text-sm leading-7 text-[var(--color-danger)]">{state.error}</p>
      ) : null}

      {state.success && state.data?.id ? (
        <p className="text-sm leading-7 text-[var(--color-success)]">
          Supplier saved. View it at{" "}
          <Link href={`/suppliers/${state.data.id}`} className="underline underline-offset-4">
            /suppliers/{state.data.id}
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
              ? "Create Supplier"
              : "Save Changes"}
        </button>
        <Link href="/suppliers" className="button-secondary">
          Back to Suppliers
        </Link>
      </div>
    </form>
  );
}
