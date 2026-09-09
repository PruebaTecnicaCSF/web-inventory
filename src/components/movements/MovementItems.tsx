"use client";

import { Lock, Plus, Trash2, X } from "lucide-react";

import type { MovementLine } from "@/src/components/movements/MovementPage";

import type { MovementType } from "@/src/types/movements/create-movement.dto";

import type { ProductDto } from "@/src/types/products/product.dto";

interface MovementItemsProps {
  lines: MovementLine[];
  products: ProductDto[];
  total: number;
  saving: boolean;
  readOnly: boolean;
  type: MovementType;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onProductChange: (index: number, productId: string) => void;
  onLineChange: (index: number, changes: Partial<MovementLine>) => void;
  onSave: () => void;
  onReset: () => void;
  saveLabel: string;
}

export function MovementItems({
  lines,
  products,
  total,
  saving,
  readOnly,
  type,
  onAdd,
  onRemove,
  onProductChange,
  onLineChange,
  onSave,
  onReset,
  saveLabel,
}: MovementItemsProps) {
  const currency = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  });

  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);

  const disabled = saving || readOnly;

  return (
    <section className="panel form-panel items-panel">
      <div className="panel-heading">
        <div>
          <h2>Productos del movimiento</h2>

          <p>
            {readOnly
              ? `Detalle del ${type === "INGRESO" ? "compra" : "venta"} seleccionado.`
              : "Selecciona el producto, cantidad y precio."}
          </p>
        </div>

        {!readOnly && (
          <button
            type="button"
            className="text-button"
            onClick={onAdd}
            disabled={saving}
          >
            <Plus />
            Agregar línea
          </button>
        )}

        {readOnly && (
          <span className="movement-readonly-badge">
            <Lock size={13} strokeWidth={2} />
            <span>Solo lectura</span>
          </span>
        )}
      </div>

      <div className="movement-items">
        {lines.map((line, index) => (
          <div className="movement-item" key={`${line.productId}-${index}`}>
            <div className="line-number">{index + 1}</div>

            <label className="product-select">
              Producto
              {readOnly && line.productName ? (
                <input type="text" value={line.productName} disabled readOnly />
              ) : (
                <select
                  value={line.productId}
                  onChange={(event) =>
                    onProductChange(index, event.target.value)
                  }
                  disabled={disabled}
                >
                  <option value="">Selecciona un producto</option>

                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              )}
            </label>

            <label>
              Cantidad
              <input
                type="number"
                min="1"
                step="1"
                value={line.quantity}
                onChange={(event) =>
                  onLineChange(index, {
                    quantity: Number(event.target.value),
                  })
                }
                disabled={disabled}
              />
            </label>

            <label>
              Precio unitario
              <input
                type="number"
                min="0"
                step="0.01"
                value={line.unitPrice}
                onChange={(event) =>
                  onLineChange(index, {
                    unitPrice: Number(event.target.value),
                  })
                }
                disabled={disabled}
              />
            </label>

            {!readOnly && lines.length > 1 && (
              <button
                type="button"
                className="icon-button danger-hover"
                onClick={() => onRemove(index)}
                disabled={saving}
                aria-label="Eliminar línea"
              >
                <Trash2 />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="movement-total">
        <div>
          <span>Total del documento</span>

          <small>{totalItems} unidades</small>
        </div>

        <strong>{currency.format(total)}</strong>
      </div>

      {!readOnly && (
        <div className="movement-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onReset}
            disabled={saving}
          >
            <X />
            Limpiar
          </button>

          <button
            type="button"
            className="primary-button full-button"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : saveLabel}
          </button>
        </div>
      )}
    </section>
  );
}
