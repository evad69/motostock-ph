"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult, RedirectActionData } from "@/lib/actions/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthActionState = ActionResult<RedirectActionData>;

function normalizeRedirectPath(path: string) {
  return path.startsWith("/") ? path : "/dashboard";
}

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = normalizeRedirectPath(String(formData.get("next") ?? "/dashboard"));

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      success: false,
      error:
        "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    error: null,
    data: { redirectTo: nextPath },
  };
}

export async function signOut(
  _previousState: AuthActionState,
  _formData: FormData
): Promise<AuthActionState> {
  void _previousState;
  void _formData;

  const supabase = await createServerSupabaseClient();

  if (supabase) {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    error: null,
    data: { redirectTo: "/login" },
  };
}
