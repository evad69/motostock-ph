"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/types";
import { useActionToast } from "@/hooks/useActionToast";
import type { LookupItem } from "@/types";

type LookupActionState = ActionResult<{ id: string; name: string }>;

type LookupAction = (
  previousState: LookupActionState,
  formData: FormData
) => Promise<LookupActionState>;

type LookupManagerProps = {
  createAction: LookupAction;
  createHeading: string;
  deleteAction: LookupAction;
  inputPlaceholder: string;
  itemLabel: string;
  items: LookupItem[];
  updateAction: LookupAction;
};

function getLabel(itemLabel: string) {
  return itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1);
}

function LookupCreateForm({
  action,
  createHeading,
  inputPlaceholder,
  itemLabel,
}: {
  action: LookupAction;
  createHeading: string;
  inputPlaceholder: string;
  itemLabel: string;
}) {
  const label = getLabel(itemLabel);
  const initialState: LookupActionState = { success: false, error: null };
  const [state, formAction, pending] = useActionState<LookupActionState, FormData>(
    action,
    initialState
  );

  useActionToast(state, {
    successTitle: `${label} created`,
    successDescription: `The ${itemLabel} list was updated.`,
    errorTitle: `${label} creation failed`,
  });

  return (
    <form action={formAction} className="grid gap-4 border-t border-[var(--color-line)] pt-5">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
        {createHeading}
      </p>
      <input
        key={state.data?.id ?? "create"}
        name="name"
        defaultValue=""
        placeholder={inputPlaceholder}
        className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none placeholder:text-[color:var(--color-muted)] focus:border-[var(--color-accent)]"
      />
      {state.error ? (
        <p className="text-sm leading-7 text-[var(--color-danger)]">{state.error}</p>
      ) : null}
      <button type="submit" className="button-primary w-fit" disabled={pending}>
        {pending ? "Saving..." : createHeading}
      </button>
    </form>
  );
}

function LookupRowEditor({
  deleteAction,
  item,
  itemLabel,
  updateAction,
}: {
  deleteAction: LookupAction;
  item: LookupItem;
  itemLabel: string;
  updateAction: LookupAction;
}) {
  const label = getLabel(itemLabel);
  const initialState: LookupActionState = { success: false, error: null };
  const [updateState, updateFormAction, updatePending] = useActionState<
    LookupActionState,
    FormData
  >(updateAction, initialState);
  const [deleteState, deleteFormAction, deletePending] = useActionState<
    LookupActionState,
    FormData
  >(deleteAction, initialState);

  useActionToast(updateState, {
    successTitle: `${label} updated`,
    successDescription: `The ${itemLabel} list was updated.`,
    errorTitle: `${label} update failed`,
  });

  useActionToast(deleteState, {
    successTitle: `${label} deleted`,
    successDescription: `The ${itemLabel} list was updated.`,
    errorTitle: `${label} delete failed`,
  });

  const error = deleteState.error ?? updateState.error;

  return (
    <div className="grid gap-3 border-b border-[rgba(17,22,29,0.08)] pb-4 lg:grid-cols-[minmax(0,1fr)_auto]">
      <form action={updateFormAction} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <input type="hidden" name="id" value={item.id} />
        <input
          key={item.name}
          name="name"
          defaultValue={item.name}
          className="min-h-12 border-b border-[var(--color-line)] bg-transparent py-3 outline-none focus:border-[var(--color-accent)]"
        />
        <button
          type="submit"
          className="button-secondary"
          disabled={updatePending || deletePending}
        >
          {updatePending ? "Saving..." : "Save"}
        </button>
      </form>
      <form action={deleteFormAction}>
        <input type="hidden" name="id" value={item.id} />
        <button
          type="submit"
          className="button-secondary"
          disabled={updatePending || deletePending}
        >
          {deletePending ? "Deleting..." : "Delete"}
        </button>
      </form>
      {error ? (
        <p className="text-sm leading-7 text-[var(--color-danger)] lg:col-span-2">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function LookupManager({
  createAction,
  createHeading,
  deleteAction,
  inputPlaceholder,
  itemLabel,
  items,
  updateAction,
}: LookupManagerProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <LookupCreateForm
        action={createAction}
        createHeading={createHeading}
        inputPlaceholder={inputPlaceholder}
        itemLabel={itemLabel}
      />

      <div className="border-t border-[var(--color-line)] pt-5">
        <div className="grid gap-4">
          {items.map((item) => (
            <LookupRowEditor
              key={item.id}
              deleteAction={deleteAction}
              item={item}
              itemLabel={itemLabel}
              updateAction={updateAction}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
