import { PageHeader } from "@/components/layout/PageHeader";
import { LookupManager } from "@/components/settings/LookupManager";
import {
  createBrandAction,
  deleteBrandAction,
  updateBrandAction,
} from "@/actions/brands";
import { getBrands } from "@/lib/queries/brands";

export default async function BrandsSettingsPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Settings"
        title="Brands"
        description="Manage the brand values used in product records and list filters."
      />

      <LookupManager
        createAction={createBrandAction}
        createHeading="Create Brand"
        deleteAction={deleteBrandAction}
        inputPlaceholder="e.g. NGK"
        itemLabel="brand"
        items={brands}
        updateAction={updateBrandAction}
      />
    </div>
  );
}
