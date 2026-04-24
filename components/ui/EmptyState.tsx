type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="border-t border-[var(--color-line)] py-10">
      <p className="font-display text-2xl uppercase tracking-[-0.05em]">{title}</p>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--color-muted)]">
        {description}
      </p>
    </div>
  );
}
