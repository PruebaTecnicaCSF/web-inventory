import { KardexView } from "@/src/components/kardex/KardexView";
import { Heading } from "@/src/components/ui/heading/Heading";
import { getKardexByProduct } from "@/src/services/kardex/kardex.service";
import { getProducts } from "@/src/services/products/products.service";

interface KardexPageProps {
  searchParams: Promise<{
    productId?: string;
    page?: string;
  }>;
}

export default async function KardexPageRoute({
  searchParams,
}: KardexPageProps) {
  const params = await searchParams;

  const productId = params.productId?.trim() ?? "";

  const parsedPage = Number(params.page ?? "1");

  const page =
    Number.isFinite(parsedPage) && parsedPage >= 1 ? Math.floor(parsedPage) : 1;

  const productsResponse = await getProducts({
    page: 1,
    limit: 100,
  });

  const kardexResponse = productId
    ? await getKardexByProduct({
        productId,
        page,
        limit: 10,
      })
    : null;

  return (
    <div className="content-wrap">
      <Heading
        eyebrow="Inventario"
        title="Kardex"
        description="Consulta el historial de movimientos, cantidades y valorización de un producto."
      />

      <KardexView
        products={productsResponse}
        kardex={kardexResponse}
        selectedProductId={productId}
      />
    </div>
  );
}
