import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 border-b border-[var(--color-line)] pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        {eyebrow ? (
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-4xl uppercase leading-none tracking-[-0.05em] sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-3xl text-sm leading-7 text-[color:var(--color-muted)] sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
