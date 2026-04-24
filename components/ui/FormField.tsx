import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, hint, error, children }: FormFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error ? (
        <span className="text-sm text-[var(--color-danger)]">{error}</span>
      ) : hint ? (
        <span className="text-sm text-[color:var(--color-muted)]">{hint}</span>
      ) : null}
    </label>
  );
}
