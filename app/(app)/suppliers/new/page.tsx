import { PageHeader } from "@/components/layout/PageHeader";
import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { getDefaultSupplierFormValues } from "@/lib/queries/suppliers";

export default function NewSupplierPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Supplier Form"
        title="Add Supplier"
        description="Create a supplier record with contact details, address, and notes for future stock-in tracking."
      />

      <SupplierForm mode="create" initialValues={getDefaultSupplierFormValues()} />
    </div>
  );
}
