import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  let product;

  try {
    product = await getProductById(id);
  } catch {
    notFound();
  }

  return (
    <main>
      <h1>{product.name}</h1>

      <p>Precio unitario: {product.unitPrice}</p>

      <p>Último costo: {product.lastCostPrice}</p>

      <p>Stock: {product.stock}</p>

      <p>Estado: {product.rowStatus ? "Activo" : "Inactivo"}</p>
    </main>
  );
}

function getProductById(id: string): any {
  throw new Error("Function not implemented.");
}
