import { supplierRecords, suppliers as mockSuppliers } from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { SupplierFormValues, SupplierRecord, SupplierRow } from "@/types";

function getRelationName(
  relation: { name?: string } | { name?: string }[] | null | undefined
) {
  if (Array.isArray(relation)) {
    return relation[0]?.name;
  }

  return relation?.name;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getSuppliers(search?: string): Promise<SupplierRow[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    const query = search?.trim().toLowerCase();
    return mockSuppliers.filter((supplier) =>
      query ? supplier.name.toLowerCase().includes(query) : true
    );
  }

  let query = supabase
    .from("suppliers")
    .select("id, name, contact_number, address, created_at")
    .order("name", { ascending: true });

  if (search?.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data } = await query;

  return (
    data?.map((row) => ({
      id: String(row.id),
      name: row.name,
      contact: row.contact_number ?? "-",
      location: row.address ?? "-",
      lastDelivery: formatDate(row.created_at),
    })) ?? []
  );
}

export async function getSupplierById(id: string): Promise<SupplierRecord | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return supplierRecords.find((supplier) => supplier.id === id) ?? null;
  }

  const { data: supplier } = await supabase
    .from("suppliers")
    .select("id, name, contact_number, address, notes")
    .eq("id", id)
    .maybeSingle();

  if (!supplier) {
    return null;
  }

  const { data: history } = await supabase
    .from("stock_movements")
    .select("id, quantity, note, created_at, products(name)")
    .eq("supplier_id", id)
    .eq("type", "stock_in")
    .order("created_at", { ascending: false });

  return {
    id: String(supplier.id),
    name: supplier.name,
    contactNumber: supplier.contact_number ?? "",
    address: supplier.address ?? "",
    notes: supplier.notes ?? "",
    purchaseHistory:
      history?.map((entry) => ({
        id: String(entry.id),
        date: formatDate(entry.created_at),
        product: getRelationName(entry.products) ?? "Unknown product",
        quantity: Number(entry.quantity ?? 0),
        note: entry.note ?? "",
      })) ?? [],
  };
}

export async function createSupplier(
  data: SupplierFormValues
): Promise<{ id: string }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const id = slugify(data.name);
  const { error } = await supabase.from("suppliers").insert({
    id,
    name: data.name.trim(),
    contact_number: data.contactNumber.trim(),
    address: data.address.trim(),
    notes: data.notes.trim(),
  });

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}

export async function updateSupplier(
  id: string,
  data: SupplierFormValues
): Promise<{ id: string }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const { error } = await supabase
    .from("suppliers")
    .update({
      name: data.name.trim(),
      contact_number: data.contactNumber.trim(),
      address: data.address.trim(),
      notes: data.notes.trim(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}

export async function deleteSupplier(id: string): Promise<{ id: string }> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  const { count } = await supabase
    .from("stock_movements")
    .select("*", { count: "exact", head: true })
    .eq("supplier_id", id);

  if ((count ?? 0) > 0) {
    throw new Error("Cannot delete a supplier with linked stock movements.");
  }

  const { error } = await supabase.from("suppliers").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { id };
}

export function getDefaultSupplierFormValues(
  supplier?: SupplierRecord | null
): SupplierFormValues {
  if (!supplier) {
    return {
      name: "",
      contactNumber: "",
      address: "",
      notes: "",
    };
  }

  return {
    id: supplier.id,
    name: supplier.name,
    contactNumber: supplier.contactNumber,
    address: supplier.address,
    notes: supplier.notes,
  };
}
