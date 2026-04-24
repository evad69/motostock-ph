import { brands as mockBrands } from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { LookupItem } from "@/types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getBrands(): Promise<LookupItem[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return mockBrands;
  }

  const { data } = await supabase
    .from("brands")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    data?.map((row) => ({
      id: String(row.id),
      name: row.name,
    })) ?? []
  );
}

export async function createBrand(name: string): Promise<{ id: string }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const id = slugify(name);
  const { error } = await supabase.from("brands").insert({ id, name });

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}

export async function updateBrand(id: string, name: string): Promise<{ id: string }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const { error } = await supabase.from("brands").update({ name }).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}

export async function deleteBrand(id: string): Promise<{ id: string }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const { error } = await supabase.from("brands").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}
