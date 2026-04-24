import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { UserProvider } from "@/context/UserContext";
import { getAuthState } from "@/lib/supabase/server";
import { PageLoader } from "@/components/ui/PageLoader";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const authState = await getAuthState();

  if (authState.configured && !authState.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)]">
      <UserProvider
        configured={authState.configured}
        user={authState.user}
        profile={authState.profile}
      >
        <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="lg:block">
            <Sidebar profile={authState.profile} />
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="px-6 py-5 pr-20 sm:px-8 sm:pr-24 lg:pr-8">
              <TopBar />
            </div>
            <div className="flex-1 px-6 pb-10 sm:px-8">
              <Suspense fallback={<PageLoader />}>{children}</Suspense>
            </div>
          </div>
        </div>
      </UserProvider>
    </div>
  );
}
