import { PurchasePage } from "@/src/components/purchases/PurchasePage";
import { getProducts } from "@/src/services/products/products.service";

export default async function PurchasePageRoute() {
  const productsResponse = await getProducts({
    page: 1,
    limit: 100,
  });

  return <PurchasePage products={productsResponse.data} />;
}
