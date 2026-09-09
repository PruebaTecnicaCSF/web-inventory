import { NextResponse } from "next/server";

import { createProduct } from "@/src/services/products/products.service";
import type { CreateProductDto } from "@/src/types/products/create-product.dto";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateProductDto;

    if (!body.name?.trim()) {
      return NextResponse.json(
        {
          message: "El nombre del producto es obligatorio.",
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isFinite(body.unitPrice) || body.unitPrice < 0) {
      return NextResponse.json(
        {
          message: "El precio de venta no es válido.",
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isFinite(body.lastCostPrice) || body.lastCostPrice < 0) {
      return NextResponse.json(
        {
          message: "El precio de costo no es válido.",
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isInteger(body.stock) || body.stock < 0) {
      return NextResponse.json(
        {
          message: "El stock debe ser un número entero mayor o igual a cero.",
        },
        {
          status: 400,
        },
      );
    }

    const product = await createProduct(body);

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creando producto:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo crear el producto.",
      },
      {
        status: 500,
      },
    );
  }
}