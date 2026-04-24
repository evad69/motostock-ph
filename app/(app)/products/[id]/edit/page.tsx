import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";
import { getBrands } from "@/lib/queries/brands";
import { getCategories } from "@/lib/queries/categories";
import {
  getDefaultProductFormValues,
  getProductById,
} from "@/lib/queries/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, brands, categories] = await Promise.all([
    getProductById(id),
    getBrands(),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Product Form"
        title="Edit Product"
        description="Update the master product record that drives pricing, stock visibility, and reporting."
      />

      <ProductForm
        mode="edit"
        initialValues={getDefaultProductFormValues(product)}
        brands={brands}
        categories={categories}
      />
    </div>
  );
}
