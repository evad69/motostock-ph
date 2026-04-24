import { PageHeader } from "@/components/layout/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";
import { getDefaultProductFormValues } from "@/lib/queries/products";
import { getBrands } from "@/lib/queries/brands";
import { getCategories } from "@/lib/queries/categories";

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([getBrands(), getCategories()]);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Product Form"
        title="Add Product"
        description="This form is now wired to a server action. It will create real records once Supabase table write access is configured."
      />

      <ProductForm
        mode="create"
        initialValues={getDefaultProductFormValues()}
        brands={brands}
        categories={categories}
      />
    </div>
  );
}
