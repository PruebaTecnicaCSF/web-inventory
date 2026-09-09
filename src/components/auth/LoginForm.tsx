"use client";

import { Boxes, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("pjromg@gmail.com");
  const [password, setPassword] = useState("@M123456abc");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "No se pudo iniciar sesión");
      }

      router.replace("/products");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "No se pudo iniciar sesión",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-form-wrap">
      <div className="login-form">
        <div className="mobile-login-brand">
          <div className="brand-mark">
            <Boxes />
          </div>

          <strong>Stockwise</strong>
        </div>

        <p className="eyebrow">Bienvenido de nuevo</p>

        <h2>Inicia sesión</h2>

        <p className="login-subtitle">Ingresa tus credenciales para acceder.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
          </label>

          <label>
            Contraseña
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </label>

          <div className="form-row">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              Recordarme
            </label>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            className="primary-button full-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
            {!loading && <ChevronRight />}
          </button>
        </form>
      </div>
    </div>
  );
}
