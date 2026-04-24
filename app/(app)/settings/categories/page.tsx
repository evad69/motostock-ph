import { PageHeader } from "@/components/layout/PageHeader";
import { LookupManager } from "@/components/settings/LookupManager";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/actions/categories";
import { getCategories } from "@/lib/queries/categories";

export default async function CategoriesSettingsPage() {
  const categories = await getCategories();

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
