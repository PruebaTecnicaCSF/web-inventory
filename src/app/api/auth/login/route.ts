import { NextResponse } from "next/server";

import { login } from "@/src/services/auth/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Correo y contraseña son obligatorios",
        },
        {
          status: 400,
        },
      );
    }

    const response = await login({
      email,
      password,
    });

    const nextResponse = NextResponse.json({
      user: response.user,
    });

    nextResponse.cookies.set("access_token", response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return nextResponse;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No se pudo iniciar sesión",
      },
      {
        status: 401,
      },
    );
  }
}
