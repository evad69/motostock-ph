"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  deleteSupplierAction,
  type SupplierDeleteActionState,
} from "@/actions/suppliers";
import { useActionToast } from "@/hooks/useActionToast";

type DeleteSupplierButtonProps = {
  supplierId: string;
};

export function DeleteSupplierButton({ supplierId }: DeleteSupplierButtonProps) {
  const router = useRouter();
  const initialState: SupplierDeleteActionState = { success: false, error: null };
  const [state, formAction, pending] = useActionState<
    SupplierDeleteActionState,
    FormData
  >(deleteSupplierAction, initialState);

  useActionToast(state, {
    successTitle: "Supplier deleted",
    successDescription: "The supplier record was removed.",
    errorTitle: "Supplier deletion failed",
  });

  useEffect(() => {
    if (state.success && state.data?.redirectTo) {
      router.replace(state.data.redirectTo);
      router.refresh();
    }
  }, [router, state.data?.redirectTo, state.success]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={supplierId} />
      <button type="submit" className="button-secondary" disabled={pending}>
        {pending ? "Deleting..." : "Delete Supplier"}
      </button>
    </form>
  );
}
