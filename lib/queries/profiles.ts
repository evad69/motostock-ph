import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ManagedProfile, UserProfile, UserRole } from "@/types";

type ProfileRow = {
  id: string;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
};

function toUserRole(role: string | null | undefined): UserRole {
  void role;
  return "admin";
}

function toManagedProfile(profile: ProfileRow): ManagedProfile {
  return {
    id: profile.id,
    fullName: profile.full_name,
    role: toUserRole(profile.role),
    createdAt: profile.created_at,
  };
}

export async function updateCurrentProfile(
  values: { fullName: string }
): Promise<UserProfile> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to update your profile.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: values.fullName || null })
    .eq("id", user.id)
    .select("id, full_name, role")
    .maybeSingle<{ id: string; full_name: string | null; role: string | null }>();

  if (error || !data) {
    throw new Error(error?.message || "Unable to update profile.");
  }

  return {
    id: data.id,
    fullName: data.full_name,
    role: toUserRole(data.role),
  };
}

export async function getManagedProfiles(): Promise<ManagedProfile[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data?.map((profile) => toManagedProfile(profile)) ?? [];
}

export async function updateProfileRole(
  profileId: string,
  role: UserRole
): Promise<ManagedProfile> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", profileId)
    .select("id, full_name, role, created_at")
    .maybeSingle<ProfileRow>();

  if (error || !data) {
    throw new Error(error?.message || "Unable to update user role.");
  }

  return toManagedProfile(data);
}
