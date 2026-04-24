"use client";

import { useActionState } from "react";
import { updateUserRoleAction, type RoleActionState } from "@/actions/profiles";
import { useActionToast } from "@/hooks/useActionToast";
import type { ManagedProfile } from "@/types";

type UserRoleFormProps = {
  profile: ManagedProfile;
  isCurrentUser: boolean;
};

export function UserRoleForm({ profile, isCurrentUser }: UserRoleFormProps) {
  const initialState: RoleActionState = {
    success: false,
    error: null,
  };
  const [state, formAction, pending] = useActionState<RoleActionState, FormData>(
    updateUserRoleAction,
    initialState
  );

  useActionToast(state, {
    successTitle: "Role updated",
    successDescription: "User permissions were updated.",
    errorTitle: "Role update failed",
  });

  return (
    <form
      action={formAction}
      className="grid gap-3 border-b border-[rgba(17,22,29,0.08)] pb-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_auto]"
    >
      <input type="hidden" name="profileId" value={profile.id} />
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {profile.fullName || "Unnamed user"}
          {isCurrentUser ? " (You)" : ""}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-muted)]">
          {profile.id}
        </p>
      </div>
      <select
        name="role"
        defaultValue={profile.role}
        disabled={pending || (isCurrentUser && profile.role === "admin")}
        className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="staff">Staff</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className="button-secondary" disabled={pending}>
        {pending ? "Saving..." : "Update Role"}
      </button>
      {state.error ? (
        <p className="text-sm leading-7 text-[var(--color-danger)] lg:col-span-3">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
