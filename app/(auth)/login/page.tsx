import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getAuthState } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ next }, authState] = await Promise.all([searchParams, getAuthState()]);

  if (authState.configured && authState.user) {
    redirect("/dashboard");
  }

  return (
    <main className="w-full space-y-7">
      <div className="auth-rail space-y-3 pt-2">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--color-accent)]">
          Sign In
        </p>
        <h2 className="max-w-[24rem] font-display text-4xl uppercase leading-[0.94] tracking-[-0.06em] sm:text-[3.6rem]">
          Access the operations console
        </h2>
      </div>

      <LoginForm nextPath={next} />
    </main>
  );
}
