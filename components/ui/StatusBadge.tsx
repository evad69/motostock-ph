type StatusBadgeProps = {
  tone: "neutral" | "success" | "warning" | "danger";
  children: string;
};

const toneClassMap: Record<StatusBadgeProps["tone"], string> = {
  neutral: "text-[color:var(--color-muted)]",
  success: "text-[var(--color-success)]",
  warning: "text-[var(--color-accent-strong)]",
  danger: "text-[var(--color-danger)]",
};

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <span
      className={`font-mono text-xs uppercase tracking-[0.25em] ${toneClassMap[tone]}`}
    >
      {children}
    </span>
  );
}
