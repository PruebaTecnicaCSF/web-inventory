"use client";

import { MovementPage } from "@/src/components/movements/MovementPage";

import type { ProductDto } from "@/src/types/products/product.dto";

interface SalesPageProps {
  products: ProductDto[];
}

export function SalesPage({ products }: SalesPageProps) {
  return (
    <MovementPage
      products={products}
      type="EGRESO"
      documentTitle="Registrar venta"
      documentDescription="Registra la salida de mercadería mediante una factura de venta."
      documentLabel="Factura de venta"
      partnerLabel="Socio / cliente"
      movementTitle="Datos del documento"
      movementDescription="Completa la información del movimiento."
      successTitle="Venta registrada correctamente"
      successMessage="La venta fue guardada correctamente."
      saveLabel="Guardar venta"
      movementName="venta"
    />
  );
}
