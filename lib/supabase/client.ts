"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/config";

let browserClient: SupabaseClient | null = null;

export function createBrowserSupabaseClient() {
  const env = getSupabaseEnv();

  if (!env) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient(env.url, env.anonKey);
  }

  return browserClient;
}

export type AuthenticatedUser = User;
