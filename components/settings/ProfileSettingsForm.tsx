"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileActionState } from "@/actions/profiles";
import { FormField } from "@/components/ui/FormField";
import { useActionToast } from "@/hooks/useActionToast";

type ProfileSettingsFormProps = {
  initialFullName: string;
};

export function ProfileSettingsForm({
  initialFullName,
}: ProfileSettingsFormProps) {
  const initialState: ProfileActionState = {
    success: false,
    error: null,
  };
  const [state, formAction, pending] = useActionState<ProfileActionState, FormData>(
    updateProfileAction,
    initialState
  );

  useActionToast(state, {
    successTitle: "Profile updated",
    successDescription: "Your display name was saved.",
    errorTitle: "Profile update failed",
  });

  return (
    <form action={formAction} className="grid gap-5 border-t border-[var(--color-line)] pt-5">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
        Profile
      </p>
      <FormField
        label="Display name"
        hint="Shown in the sidebar and other signed-in surfaces."
      >
        <input
          name="fullName"
          defaultValue={initialFullName}
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
        />
      </FormField>
      {state.error ? (
        <p className="text-sm leading-7 text-[var(--color-danger)]">{state.error}</p>
      ) : null}
      <button type="submit" className="button-primary w-fit" disabled={pending}>
        {pending ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
