import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/config";
import type { UserProfile } from "@/types";

type ProfileRow = {
  id: string;
  full_name: string | null;
  role: string | null;
};

function toUserProfile(profile: ProfileRow): UserProfile {
  return {
    id: profile.id,
    fullName: profile.full_name,
    role: profile.role === "admin" ? "admin" : "staff",
  };
}

async function ensureUserProfile(
  supabase: SupabaseClient,
  user: User
): Promise<UserProfile | null> {
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (existingProfile) {
    return toUserProfile(existingProfile);
  }

  const fallbackName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null;

  const { data: createdProfile } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: fallbackName,
        role: "staff",
      },
      { onConflict: "id" }
    )
    .select("id, full_name, role")
    .maybeSingle<ProfileRow>();

  return createdProfile ? toUserProfile(createdProfile) : null;
}

export async function createServerSupabaseClient(): Promise<SupabaseClient | null> {
  const env = getSupabaseEnv();

  if (!env) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Components cannot always mutate cookies during render.
        }
      },
    },
  });
}

export async function getAuthState(): Promise<{
  configured: boolean;
  user: User | null;
  profile: UserProfile | null;
}> {
  if (!isSupabaseConfigured()) {
    return { configured: false, user: null, profile: null };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { configured: false, user: null, profile: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { configured: true, user: null, profile: null };
  }

  return {
    configured: true,
    user,
    profile: await ensureUserProfile(supabase, user),
  };
}

export function toCookieOptions(options: CookieOptions) {
  return {
    ...options,
    sameSite: options.sameSite as "lax" | "strict" | "none" | undefined,
  };
}
