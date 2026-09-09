import { NextResponse } from "next/server";

import { getMovementByReferenceDoc } from "@/src/services/movements/movements.service";

interface RouteContext {
  params: Promise<{
    referenceDoc: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { referenceDoc } = await params;

    if (!referenceDoc?.trim()) {
      return NextResponse.json(
        {
          message: "El documento de referencia es obligatorio.",
        },
        { status: 400 },
      );
    }

    const movement = await getMovementByReferenceDoc(referenceDoc);

    return NextResponse.json(movement, {
      status: 200,
    });
  } catch (error) {
    console.error("Error buscando movimiento por referenceDoc:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se encontró el movimiento.",
      },
      { status: 404 },
    );
  }
}
