"use client";

import { ArrowDownToLine, ArrowUpFromLine, Lock } from "lucide-react";

import type {
  MovementStatus,
  MovementType,
} from "@/src/types/movements/create-movement.dto";

import type { MovementFormState } from "@/src/components/movements/MovementPage";

interface MovementDocumentFormProps {
  form: MovementFormState;
  type: MovementType;
  documentLabel: string;
  partnerLabel: string;
  title: string;
  description: string;
  disabled: boolean;
  onChange: (changes: Partial<Omit<MovementFormState, "lines">>) => void;
}

export function MovementDocumentForm({
  form,
  type,
  documentLabel,
  partnerLabel,
  title,
  description,
  disabled,
  onChange,
}: MovementDocumentFormProps) {
  const isIncome = type === "INGRESO";

  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>

          <p>
            {disabled ? "Documento existente en modo consulta." : description}
          </p>
        </div>

        <div className="movement-heading-actions">
          <span
            className={
              isIncome
                ? "movement-badge badge-green"
                : "movement-badge badge-blue"
            }
          >
            {isIncome ? <ArrowDownToLine /> : <ArrowUpFromLine />}

            {type}
          </span>

          {disabled && (
            <span
              className="movement-readonly-badge"
              title="La edición no está disponible"
            >
              <Lock size={13} strokeWidth={2} />

              <span>Solo lectura</span>
            </span>
          )}
        </div>
      </div>

      <div className="form-grid">
        <label>
          Tipo de documento
          <select value={documentLabel} disabled>
            <option>{documentLabel}</option>
          </select>
        </label>

        <label>
          Número de documento
          <input
            type="text"
            value={form.documentId}
            onChange={(event) =>
              onChange({
                documentId: event.target.value,
              })
            }
            placeholder={isIncome ? "FAC-COMPRA-001" : "FAC-VENTA-001"}
            disabled={disabled}
          />
        </label>

        <label>
          {partnerLabel}

          <input
            type="text"
            value={form.partnerId}
            onChange={(event) =>
              onChange({
                partnerId: event.target.value,
              })
            }
            placeholder={isIncome ? "ID del proveedor..." : "ID del cliente..."}
            disabled={disabled}
          />
        </label>

        <label>
          Estado
          <select
            value={form.status}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                status: event.target.value as MovementStatus,
              })
            }
          >
            <option value="PAGADA">PAGADA</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="ANULADA">ANULADA</option>
          </select>
        </label>

        <label className="full-field">
          Documento de referencia
          <textarea
            value={form.referenceDoc}
            onChange={(event) =>
              onChange({
                referenceDoc: event.target.value,
              })
            }
            placeholder={
              isIncome
                ? "Factura de Compra Proveedor Tech Lote A"
                : "Factura de Venta Cliente A"
            }
            disabled={disabled}
          />
        </label>
      </div>
    </section>
  );
}
