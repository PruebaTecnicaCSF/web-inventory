import { NextResponse } from "next/server";

import {
    createMovement,
    getMovementByDocumentId,
} from "@/src/services/movements/movements.service";

import type { CreateMovementDto } from "@/src/types/movements/create-movement.dto";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateMovementDto;

    if (!body.type) {
      return NextResponse.json(
        {
          message: "El tipo de movimiento es obligatorio.",
        },
        { status: 400 },
      );
    }

    if (!body.documentId?.trim()) {
      return NextResponse.json(
        {
          message: "El número de documento es obligatorio.",
        },
        { status: 400 },
      );
    }

    if (!body.partnerId?.trim()) {
      return NextResponse.json(
        {
          message: "El socio o cliente es obligatorio.",
        },
        { status: 400 },
      );
    }

    if (!body.referenceDoc?.trim()) {
      return NextResponse.json(
        {
          message: "El documento de referencia es obligatorio.",
        },
        { status: 400 },
      );
    }

    if (!body.status) {
      return NextResponse.json(
        {
          message: "El estado es obligatorio.",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.movementItems) || body.movementItems.length === 0) {
      return NextResponse.json(
        {
          message: "Debes agregar al menos un producto al movimiento.",
        },
        { status: 400 },
      );
    }

    for (const item of body.movementItems) {
      if (!item.productId?.trim()) {
        return NextResponse.json(
          {
            message: "Todos los productos deben tener un ID válido.",
          },
          { status: 400 },
        );
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          {
            message: "La cantidad debe ser un número entero mayor que cero.",
          },
          { status: 400 },
        );
      }

      if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
        return NextResponse.json(
          {
            message: "El precio unitario debe ser un número válido.",
          },
          { status: 400 },
        );
      }
    }

    const movement = await createMovement(body);

    return NextResponse.json(movement, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creando movimiento:", error);

    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 500;

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo registrar el movimiento.",
      },
      { status },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const documentId = searchParams.get("documentId")?.trim() ?? "";

    if (!documentId) {
      return NextResponse.json(
        {
          message: "Debes indicar el número de documento.",
        },
        { status: 400 },
      );
    }

    const movement = await getMovementByDocumentId(documentId);

    return NextResponse.json(movement, {
      status: 200,
    });
  } catch (error) {
    console.error("Error buscando movimiento:", error);

    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 404;

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se encontró el movimiento.",
      },
      { status },
    );
  }
}
