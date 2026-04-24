"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/actions/types";
import {
  updateCurrentProfile,
  updateProfileRole,
} from "@/lib/queries/profiles";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ManagedProfile, UserProfile, UserRole } from "@/types";

export type ProfileActionState = ActionResult<UserProfile>;
export type RoleActionState = ActionResult<ManagedProfile>;

export async function updateProfileAction(
  _previousState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();

  if (!fullName) {
    return { success: false, error: "Display name is required." };
  }

  try {
    const data = await updateCurrentProfile({ fullName });
    revalidatePath("/", "layout");
    revalidatePath("/settings");
    return { success: true, error: null, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to update profile.",
    };
  }
}

export async function updateUserRoleAction(
  _previousState: RoleActionState,
  formData: FormData
): Promise<RoleActionState> {
  const profileId = String(formData.get("profileId") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim() as UserRole;

  if (!profileId) {
    return { success: false, error: "Missing profile id." };
  }

  if (role !== "admin") {
    return { success: false, error: "All accounts use admin access." };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { success: false, error: "Supabase is not configured yet." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<{ role: string | null }>();

  if ((currentProfile?.role ?? "admin") !== "admin") {
    return { success: false, error: "Only admins can manage user roles." };
  }

  try {
    const data = await updateProfileRole(profileId, role);
    revalidatePath("/", "layout");
    revalidatePath("/settings");
    return { success: true, error: null, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to update user role.",
    };
  }
}
