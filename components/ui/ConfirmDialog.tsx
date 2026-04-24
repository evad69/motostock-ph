"use client";

import { useState } from "react";

type ConfirmDialogProps = {
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel?: string;
};

export function ConfirmDialog({
  triggerLabel,
  title,
  description,
  confirmLabel = "Confirm",
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="button-secondary" onClick={() => setOpen(true)}>
        {triggerLabel}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,22,29,0.42)] px-4">
          <div className="w-full max-w-md border border-[var(--color-line)] bg-[var(--color-canvas)] p-6">
            <div className="space-y-3">
              <p className="font-display text-2xl uppercase tracking-[-0.05em]">
                {title}
              </p>
              <p className="text-sm leading-7 text-[color:var(--color-muted)]">
                {description}
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="button-primary"
                onClick={() => setOpen(false)}
              >
                {confirmLabel}
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
