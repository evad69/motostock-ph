"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { signIn, type AuthActionState } from "@/actions/auth";
import { FormField } from "@/components/ui/FormField";
import { useActionToast } from "@/hooks/useActionToast";

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/dashboard" }: LoginFormProps) {
  const router = useRouter();
  const initialAuthActionState: AuthActionState = {
    success: false,
    error: null,
  };
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    signIn,
    initialAuthActionState
  );
  useActionToast(state, {
    errorTitle: "Sign in failed",
  });

  useEffect(() => {
    if (state.success && state.data?.redirectTo) {
      router.replace(state.data.redirectTo);
      router.refresh();
    }
  }, [router, state.data?.redirectTo, state.success]);

  return (
    <form action={formAction} className="grid gap-5 border-t border-[var(--color-line)] pt-5">
      <input type="hidden" name="next" value={nextPath} />

      <FormField label="Email">
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="owner@motostock.ph"
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent px-0 py-3 outline-none placeholder:text-[color:var(--color-muted)] focus:border-[var(--color-accent)]"
        />
      </FormField>

      <FormField label="Password">
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="password"
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent px-0 py-3 outline-none placeholder:text-[color:var(--color-muted)] focus:border-[var(--color-accent)]"
        />
      </FormField>

      {state.error ? (
        <p className="text-sm leading-7 text-[var(--color-danger)]">{state.error}</p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="button-primary min-w-36" disabled={pending}>
          {pending ? "Signing In..." : "Continue"}
        </button>
      </div>
    </form>
  );
}
