"use client";

import { usePathname } from "next/navigation";
import { navigation } from "@/lib/site";

export function TopBar() {
  const pathname = usePathname();
  const activePage = navigation.find((item) => item.href === pathname);

  return (
    <div className="border-b border-[var(--color-line)] pb-4">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
          Operations Console
        </p>
        <h2 className="font-display text-2xl uppercase tracking-[-0.05em]">
          {activePage?.label ?? "Workspace"}
        </h2>
      </div>
    </div>
  );
}
