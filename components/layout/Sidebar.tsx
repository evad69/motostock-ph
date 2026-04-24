"use client";

import { useActionState, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/site";
import { signOut, type AuthActionState } from "@/actions/auth";
import { useActionToast } from "@/hooks/useActionToast";
import type { UserProfile } from "@/types";

type SidebarProps = {
  profile?: UserProfile | null;
};

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initialSignOutState: AuthActionState = { success: false, error: null };
  const [signOutState, signOutFormAction, signOutPending] = useActionState<
    AuthActionState,
    FormData
  >(signOut, initialSignOutState);
  const displayName = profile?.fullName ?? "Signed-in user";
  const role = profile?.role ?? "admin";

  useActionToast(signOutState, {
    errorTitle: "Sign out failed",
  });

  useEffect(() => {
    if (signOutState.success && signOutState.data?.redirectTo) {
      window.location.href = signOutState.data.redirectTo;
    }
  }, [signOutState.data?.redirectTo, signOutState.success]);

  return (
    <>
      <button
        type="button"
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
        className="fixed right-4 top-4 z-50 inline-flex min-h-12 min-w-12 items-center justify-center border border-[var(--color-line)] bg-[rgba(244,240,232,0.96)] text-[var(--color-ink)] backdrop-blur lg:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-[var(--color-canvas)] px-6 py-6 lg:hidden">
          <div className="space-y-8">
            <div className="space-y-3 border-b border-[var(--color-line)] pb-5 pr-16">
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-accent)]">
                MotoStock
              </p>
              <div>
                <p className="font-display text-4xl uppercase leading-none tracking-[-0.08em]">
                  PH
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">
                  Store operations, inventory, and sales in one place.
                </p>
              </div>
            </div>

            <nav className="grid gap-2">
              {navigation.map(({ href, icon: Icon, label }) => {
                const active = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex min-h-12 items-center gap-3 border-l px-3 py-3 text-base transition-colors ${
                      active
                        ? "border-[var(--color-accent)] text-[var(--color-ink)]"
                        : "border-transparent text-[color:var(--color-muted)]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-4 border-t border-[var(--color-line)] pt-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
                  Signed in as
                </p>
                <p className="mt-2 text-sm font-medium">{displayName}</p>
                <p className="text-sm text-[color:var(--color-muted)]">{role}</p>
              </div>
              <form action={signOutFormAction}>
                <button type="submit" className="button-secondary w-full" disabled={signOutPending}>
                  {signOutPending ? "Signing Out..." : "Sign Out"}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      <aside className="hidden h-full flex-col justify-between border-r border-[var(--color-line)] bg-[rgba(244,240,232,0.88)] px-4 py-6 backdrop-blur md:px-6 lg:flex">
        <div className="space-y-8">
          <div className="space-y-2 border-b border-[var(--color-line)] pb-5">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-accent)]">
              MotoStock
            </p>
            <div>
              <p className="font-display text-3xl uppercase leading-none tracking-[-0.08em]">
                PH
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">
                Store operations, inventory, and sales in one place.
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {navigation.map(({ href, icon: Icon, label }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex min-h-11 min-w-0 items-center justify-start gap-3 border-l px-3 py-3 text-sm transition-colors ${
                    active
                      ? "border-[var(--color-accent)] text-[var(--color-ink)]"
                      : "border-transparent text-[color:var(--color-muted)] hover:border-[rgba(17,22,29,0.14)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="max-w-full truncate">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 border-t border-[var(--color-line)] pt-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Signed in as
            </p>
            <p className="mt-2 text-sm font-medium">{displayName}</p>
            <p className="text-sm text-[color:var(--color-muted)]">{role}</p>
          </div>
          <form action={signOutFormAction}>
            <button type="submit" className="button-secondary w-full" disabled={signOutPending}>
              {signOutPending ? "Signing Out..." : "Sign Out"}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
