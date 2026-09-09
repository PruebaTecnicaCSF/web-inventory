"use client";

import { MovementPage } from "@/src/components/movements/MovementPage";

import type { ProductDto } from "@/src/types/products/product.dto";

interface PurchasePageProps {
  products: ProductDto[];
}

export function PurchasePage({ products }: PurchasePageProps) {
  return (
    <MovementPage
      products={products}
      type="INGRESO"
      documentTitle="Registrar compra"
      documentDescription="Ingresa mercadería al inventario mediante una factura de compra."
      documentLabel="Factura de compra"
      partnerLabel="Socio / proveedor"
      movementTitle="Datos del documento"
      movementDescription="Completa la información del movimiento."
      successTitle="Compra registrada correctamente"
      successMessage="La compra fue guardada correctamente."
      saveLabel="Guardar compra"
      movementName="compra"
    />
  );
}
