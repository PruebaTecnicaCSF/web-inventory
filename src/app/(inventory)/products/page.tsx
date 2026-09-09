import { CreateProductButton } from "@/src/components/products/CreateProductButton";
import { ProductsTable } from "@/src/components/products/ProductsTable";
import { Heading } from "@/src/components/ui/heading/Heading";
import { getProducts } from "@/src/services/products/products.service";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function ProductsPageRoute({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const parsedPage = Number(params.page ?? "1");

  const page =
    Number.isFinite(parsedPage) && parsedPage >= 1 ? Math.floor(parsedPage) : 1;

  const productsResponse = await getProducts({
    page,
    limit: 10,
  });

  return (
    <div className="content-wrap">
      <Heading
        eyebrow="Catálogo"
        title="Productos"
        description="Administra el catálogo y consulta el stock disponible."
        action={<CreateProductButton />}
      />

      <ProductsTable data={productsResponse} />
    </div>
  );
}
