import { SalesPage } from "@/src/components/sales/SalesPage";
import { getProducts } from "@/src/services/products/products.service";

export default async function SalesPageRoute() {
  const productsResponse = await getProducts({
    page: 1,
    limit: 100,
  });

  return (
    <SalesPage
      products={productsResponse.data}
    />
  );
}