import { getAuthState } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { LookupManager } from "@/components/settings/LookupManager";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/actions/categories";
import { getCategories } from "@/lib/queries/categories";

export default async function CategoriesSettingsPage() {
  const [authState, categories] = await Promise.all([getAuthState(), getCategories()]);

  if (authState.configured && authState.profile?.role === "staff") {
    redirect("/settings");
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Settings"
        title="Categories"
        description="Manage the product categories used across filtering, forms, and reporting."
      />

      <LookupManager
        createAction={createCategoryAction}
        createHeading="Create Category"
        deleteAction={deleteCategoryAction}
        inputPlaceholder="e.g. Suspension"
        itemLabel="category"
        items={categories}
        updateAction={updateCategoryAction}
      />
    </div>
  );
}
