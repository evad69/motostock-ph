"use client";

import { useActionState } from "react";
import { archiveProductAction, type ProductActionState } from "@/actions/products";
import { useActionToast } from "@/hooks/useActionToast";

type ArchiveProductButtonProps = {
  productId: string;
};

export function ArchiveProductButton({ productId }: ArchiveProductButtonProps) {
  const initialState: ProductActionState = { success: false, error: null };
  const [state, formAction, pending] = useActionState<ProductActionState, FormData>(
    archiveProductAction,
    initialState
  );

  useActionToast(state, {
    successTitle: "Product archived",
    successDescription: "The product was removed from active inventory listings.",
    errorTitle: "Archive failed",
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={productId} />
      <button type="submit" className="button-secondary" disabled={pending || state.success}>
        {pending ? "Archiving..." : state.success ? "Archived" : "Archive"}
      </button>
    </form>
  );
}
