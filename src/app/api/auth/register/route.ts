import { NextResponse } from "next/server";

import { registerUser } from "@/src/services/users/users.service";

interface RegisterRequestBody {
  email?: string;
  password?: string;
  name?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterRequestBody;

    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";
    const name = body.name?.trim() ?? "";

    if (!name) {
      return NextResponse.json(
        {
          message: "El nombre es obligatorio.",
        },
        {
          status: 400,
        },
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          message: "El correo electrónico es obligatorio.",
        },
        {
          status: 400,
        },
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          message: "La contraseña es obligatoria.",
        },
        {
          status: 400,
        },
      );
    }

    const response = await registerUser({
      name,
      email,
      password,
    });

    return NextResponse.json(
      {
        user: response.user,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Register user error:", error);

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
            : "No se pudo registrar el usuario.",
      },
      {
        status,
      },
    );
  }
}
