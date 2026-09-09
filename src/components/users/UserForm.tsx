"use client";

import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";

interface UserFormProps {
  disabled?: boolean;
  onSuccess: () => void;
  onFeedback: (
    variant: "error" | "success",
    title: string,
    message: string,
  ) => void;
}

interface UserFormState {
  name: string;
  email: string;
  password: string;
}

const INITIAL_FORM: UserFormState = {
  name: "",
  email: "",
  password: "",
};

export function UserForm({
  disabled = false,
  onSuccess,
  onFeedback,
}: UserFormProps) {
  const [form, setForm] = useState<UserFormState>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function updateField(field: keyof UserFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setShowPassword(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!name) {
      onFeedback("error", "Nombre requerido", "Ingresa el nombre del usuario.");
      return;
    }

    if (!email) {
      onFeedback(
        "error",
        "Correo requerido",
        "Ingresa el correo electrónico del usuario.",
      );
      return;
    }

    if (!email.includes("@")) {
      onFeedback(
        "error",
        "Correo inválido",
        "Ingresa un correo electrónico válido.",
      );
      return;
    }

    if (!password) {
      onFeedback(
        "error",
        "Contraseña requerida",
        "Ingresa una contraseña para el usuario.",
      );
      return;
    }

    if (password.length < 6) {
      onFeedback(
        "error",
        "Contraseña inválida",
        "La contraseña debe tener al menos 6 caracteres.",
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result?.message === "string"
            ? result.message
            : "No se pudo registrar el usuario.",
        );
      }

      resetForm();

      onFeedback(
        "success",
        "Usuario registrado",
        `${result.user?.name ?? "El usuario"} fue registrado correctamente.`,
      );

      onSuccess();
    } catch (error) {
      onFeedback(
        "error",
        "No se pudo registrar",
        error instanceof Error
          ? error.message
          : "Ocurrió un error al registrar el usuario.",
      );
    } finally {
      setSaving(false);
    }
  }

  const isDisabled = disabled || saving;

  return (
    <section className="panel form-panel users-form-panel">
      <div className="panel-heading">
        <div>
          <h2>Nuevo usuario</h2>
          <p>Registra una nueva cuenta para acceder al sistema.</p>
        </div>
      </div>

      <form className="form-grid users-form-grid" onSubmit={handleSubmit}>
        <label className="full-field">
          Nombre completo
          <input
            type="text"
            placeholder="Ej. Paul R."
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            disabled={isDisabled}
            autoComplete="name"
          />
        </label>

        <label className="full-field">
          Correo electrónico
          <input
            type="email"
            placeholder="usuario@empresa.com"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            disabled={isDisabled}
            autoComplete="email"
          />
        </label>

        <label className="full-field">
          Contraseña
          <div className="users-password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa una contraseña"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              disabled={isDisabled}
              autoComplete="new-password"
            />

            <button
              type="button"
              className="icon-button"
              onClick={() => setShowPassword((current) => !current)}
              disabled={isDisabled}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </label>

        <div className="users-form-actions full-field">
          <button
            type="button"
            className="secondary-button"
            onClick={resetForm}
            disabled={isDisabled}
          >
            Limpiar
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={isDisabled}
          >
            <UserPlus />

            {saving ? "Registrando..." : "Registrar usuario"}
          </button>
        </div>
      </form>

      <div className="users-form-note">
        <span>
          La edición y desactivación estarán disponibles próximamente.
        </span>
      </div>
    </section>
  );
}
