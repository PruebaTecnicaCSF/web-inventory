"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface ProductFormState {
  name: string;
  sku: string;
  category: string;
  unitPrice: string;
  lastCostPrice: string;
  stock: string;
}

const INITIAL_FORM: ProductFormState = {
  name: "",
  sku: "",
  category: "General",
  unitPrice: "",
  lastCostPrice: "",
  stock: "0",
};

export function CreateProductModal({
  isOpen,
  onClose,
  onCreated,
}: CreateProductModalProps) {
  const [form, setForm] = useState<ProductFormState>(INITIAL_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM);
      setError("");
      setIsSaving(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) {
    return null;
  }

  function updateField(field: keyof ProductFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const unitPrice = Number(form.unitPrice);
    const lastCostPrice = Number(form.lastCostPrice);
    const stock = Number(form.stock);

    if (!name) {
      setError("Ingresa el nombre del producto.");
      return;
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      setError("Ingresa un precio de venta válido.");
      return;
    }

    if (!Number.isFinite(lastCostPrice) || lastCostPrice < 0) {
      setError("Ingresa un precio de costo válido.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("El stock debe ser un número entero mayor o igual a cero.");
      return;
    }

    setIsSaving(true);
    setError("");

    const now = new Date().toISOString();

    const payload = {
      name,
      unitPrice: unitPrice,
      lastCostPrice: lastCostPrice,
      stock
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "message" in result &&
          typeof result.message === "string"
            ? result.message
            : "No se pudo crear el producto.";

        throw new Error(message);
      }

      setForm(INITIAL_FORM);
      onClose();
      onCreated();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo crear el producto.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-product-title"
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">Catálogo</p>

            <h2 id="create-product-title">Nuevo producto</h2>

            <p>Registra un producto para incorporarlo al inventario.</p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Cerrar"
          >
            <X />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Nombre del producto
            <input
              autoFocus
              type="text"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Ej. Laptop HP ProBook"
              disabled={isSaving}
              required
            />
          </label>

          <label>
            SKU
            <input
              type="text"
              value={form.sku}
              onChange={(event) => updateField("sku", event.target.value)}
              placeholder="Ej. TEC-HP-006"
              disabled={isSaving}
            />
          </label>

          <div className="form-grid">
            <label>
              Categoría
              <select
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
                disabled={isSaving}
              >
                <option value="General">General</option>

                <option value="Tecnología">Tecnología</option>

                <option value="Accesorios">Accesorios</option>
              </select>
            </label>

            <label>
              Stock inicial
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(event) => updateField("stock", event.target.value)}
                placeholder="0"
                disabled={isSaving}
                required
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              Precio de venta
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.unitPrice}
                onChange={(event) =>
                  updateField("unitPrice", event.target.value)
                }
                placeholder="0.00"
                disabled={isSaving}
                required
              />
            </label>

            <label>
              Precio de costo
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.lastCostPrice}
                onChange={(event) =>
                  updateField("lastCostPrice", event.target.value)
                }
                placeholder="0.00"
                disabled={isSaving}
                required
              />
            </label>
          </div>

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>

            <button
              className="primary-button"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Creando..." : "Crear producto"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
