export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

function normalize(value: string | undefined) {
  return value?.trim() ?? "";
}

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = normalize(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey =
    normalize(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    normalize(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured() {
  return getSupabaseEnv() !== null;
}
