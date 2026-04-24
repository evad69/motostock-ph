import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";
import { UserRoleForm } from "@/components/settings/UserRoleForm";
import { getManagedProfiles } from "@/lib/queries/profiles";
import { getAuthState } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const authState = await getAuthState();
  let profiles = [];

  if (authState.configured) {
    try {
      profiles = await getManagedProfiles();
    } catch {
      profiles = [];
    }
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Settings"
        title="Settings"
        description="Manage your profile, product metadata, and role access from one operational settings workspace."
      />

      <section className="grid gap-8 border-t border-[var(--color-line)] pt-8 lg:grid-cols-2">
        <article className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            Profile
          </p>
          <h2 className="font-display text-3xl uppercase tracking-[-0.05em]">
            Personal details
          </h2>
          <p className="text-sm leading-7 text-[color:var(--color-muted)]">
            Keep your operator name current so the workspace reflects who is signed in.
          </p>
          <ProfileSettingsForm initialFullName={authState.profile?.fullName ?? ""} />
        </article>

        <article className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            Product Metadata
          </p>
          <h2 className="font-display text-3xl uppercase tracking-[-0.05em]">
            Categories and brands
          </h2>
          <p className="text-sm leading-7 text-[color:var(--color-muted)]">
            Keep product selection lists consistent and manageable from a single admin surface.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/settings/categories" className="button-secondary">
              Manage Categories
            </Link>
            <Link href="/settings/brands" className="button-secondary">
              Manage Brands
            </Link>
          </div>
        </article>
      </section>

      <section className="grid gap-8 border-t border-[var(--color-line)] pt-8 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            Access
          </p>
          <h2 className="font-display text-3xl uppercase tracking-[-0.05em]">
            Current permission view
          </h2>
          <p className="text-sm leading-7 text-[color:var(--color-muted)]">
            Admin access is active across the workspace.
          </p>
          <p className="text-sm leading-7 text-[color:var(--color-muted)]">
            Every account is treated as an admin account.
          </p>
        </article>

        <article className="space-y-4 border-t border-[var(--color-line)] pt-4 lg:border-t-0 lg:pt-0">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            User Management
          </p>
          <h2 className="font-display text-3xl uppercase tracking-[-0.05em]">
            Roles and permissions
          </h2>
          {authState.configured ? (
            profiles.length > 0 ? (
              <div className="grid gap-4">
                {profiles.map((profile) => (
                  <UserRoleForm
                    key={profile.id}
                    profile={profile}
                    isCurrentUser={profile.id === authState.user?.id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm leading-7 text-[color:var(--color-muted)]">
                User records are not available yet for this session.
              </p>
            )
          ) : null}
        </article>
      </section>
    </div>
  );
}
