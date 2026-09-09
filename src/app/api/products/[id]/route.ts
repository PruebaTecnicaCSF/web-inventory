import { NextResponse } from "next/server";

import { getProductById } from "@/src/services/products/products.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          message: "El ID del producto es obligatorio.",
        },
        {
          status: 400,
        },
      );
    }

    const response = await getProductById(id);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error buscando producto:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo encontrar el producto.",
      },
      {
        status: 404,
      },
    );
  }
}
