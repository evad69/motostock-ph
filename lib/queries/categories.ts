import { categories as mockCategories } from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { LookupItem } from "@/types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getCategories(): Promise<LookupItem[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return mockCategories;
  }

  const { data } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    data?.map((row) => ({
      id: String(row.id),
      name: row.name,
    })) ?? []
  );
}

export async function createCategory(name: string): Promise<{ id: string }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const id = slugify(name);
  const { error } = await supabase.from("categories").insert({ id, name });

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}

export async function updateCategory(id: string, name: string): Promise<{ id: string }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const { error } = await supabase.from("categories").update({ name }).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}

export async function deleteCategory(id: string): Promise<{ id: string }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}
