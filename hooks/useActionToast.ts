"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/Toast";

type ActionToastState = {
  success: boolean;
  error: string | null;
};

type UseActionToastOptions = {
  successTitle?: string;
  successDescription?: string;
  errorTitle?: string;
};

export function useActionToast(
  state: ActionToastState,
  options: UseActionToastOptions = {}
) {
  const { pushToast } = useToast();
  const previousRef = useRef<ActionToastState>({ success: false, error: null });

  useEffect(() => {
    if (state.error && state.error !== previousRef.current.error) {
      pushToast({
        tone: "error",
        title: options.errorTitle ?? "Action failed",
        description: state.error,
      });
    }

    if (state.success && !previousRef.current.success) {
      pushToast({
        tone: "success",
        title: options.successTitle ?? "Saved",
        description: options.successDescription,
      });
    }

    previousRef.current = { success: state.success, error: state.error };
  }, [
    options.errorTitle,
    options.successDescription,
    options.successTitle,
    pushToast,
    state.error,
    state.success,
  ]);
}
