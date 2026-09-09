"use client";

import { useMemo, useRef, useState } from "react";

import { MovementDocumentForm } from "@/src/components/movements/MovementDocumentForm";
import { MovementItems } from "@/src/components/movements/MovementItems";
import { MovementSearch } from "@/src/components/movements/MovementSearch";
import type { FeedbackVariant } from "@/src/components/ui/feedback/FeedbackMessage";
import { FeedbackMessage } from "@/src/components/ui/feedback/FeedbackMessage";
import { Toast } from "@/src/components/ui/feedback/Toast";
import { Heading } from "@/src/components/ui/heading/Heading";

import type {
  CreateMovementDto,
  MovementStatus,
  MovementType,
} from "@/src/types/movements/create-movement.dto";
import type { MovementDto } from "@/src/types/movements/movement.dto";
import type { ProductDto } from "@/src/types/products/product.dto";

export interface MovementLine {
  productId: string;
  productName?: string | null;
  quantity: number;
  unitPrice: number;
}

export interface MovementFormState {
  documentId: string;
  partnerId: string;
  status: MovementStatus;
  referenceDoc: string;
  lines: MovementLine[];
}

interface MovementPageProps {
  products: ProductDto[];
  type: MovementType;
  documentTitle: string;
  documentDescription: string;
  documentLabel: string;
  partnerLabel: string;
  movementTitle: string;
  movementDescription: string;
  successTitle: string;
  successMessage: string;
  saveLabel: string;
  movementName: string;
}

interface FeedbackState {
  variant: FeedbackVariant;
  title: string;
  message: string;
}

function getInitialPrice(product: ProductDto | undefined, type: MovementType) {
  if (!product) {
    return 0;
  }

  return type === "INGRESO" ? product.lastCostPrice : product.unitPrice;
}

function createInitialLine(
  products: ProductDto[],
  type: MovementType,
): MovementLine {
  const product = products[0];

  return {
    productId: product?.id ?? "",
    productName: product?.name ?? null,
    quantity: 1,
    unitPrice: getInitialPrice(product, type)??0,
  };
}

function createInitialForm(
  products: ProductDto[],
  type: MovementType,
): MovementFormState {
  return {
    documentId: "",
    partnerId: "",
    status: "PAGADA",
    referenceDoc: "",
    lines: [createInitialLine(products, type)],
  };
}

export function MovementPage({
  products,
  type,
  documentTitle,
  documentDescription,
  documentLabel,
  partnerLabel,
  movementTitle,
  movementDescription,
  successTitle,
  successMessage,
  saveLabel,
  movementName,
}: MovementPageProps) {
  const [form, setForm] = useState<MovementFormState>(() =>
    createInitialForm(products, type),
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isExistingMovement, setIsExistingMovement] = useState(false);

  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [toast, setToast] = useState<FeedbackState | null>(null);

  const feedbackRef = useRef<HTMLDivElement>(null);

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
      }),
    [],
  );

  const total = useMemo(
    () =>
      form.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
    [form.lines],
  );

  function showFeedback(nextFeedback: FeedbackState, showToast = true) {
    setFeedback(nextFeedback);

    if (showToast) {
      setToast(nextFeedback);
    }

    requestAnimationFrame(() => {
      feedbackRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  function clearFeedback() {
    setFeedback(null);
  }

  function clearToast() {
    setToast(null);
  }

  function resetForm() {
    setForm(createInitialForm(products, type));
    setSearchQuery("");
    setIsExistingMovement(false);
    clearFeedback();
    clearToast();
  }

  function updateDocument(changes: Partial<Omit<MovementFormState, "lines">>) {
    if (isExistingMovement) {
      return;
    }

    setForm((current) => ({
      ...current,
      ...changes,
    }));
  }

  function updateLine(index: number, changes: Partial<MovementLine>) {
    if (isExistingMovement) {
      return;
    }

    setForm((current) => ({
      ...current,
      lines: current.lines.map((line, lineIndex) =>
        lineIndex === index
          ? {
              ...line,
              ...changes,
            }
          : line,
      ),
    }));
  }

  function addLine() {
    if (isExistingMovement) {
      return;
    }

    setForm((current) => ({
      ...current,
      lines: [...current.lines, createInitialLine(products, type)],
    }));
  }

  function removeLine(index: number) {
    if (isExistingMovement) {
      return;
    }

    setForm((current) => {
      if (current.lines.length <= 1) {
        return current;
      }

      return {
        ...current,
        lines: current.lines.filter((_, lineIndex) => lineIndex !== index),
      };
    });
  }

  function changeProduct(index: number, productId: string) {
    if (isExistingMovement) {
      return;
    }

    const product = products.find((item) => item.id === productId);

    updateLine(index, {
      productId,
      productName: product?.name ?? null,
      unitPrice: getInitialPrice(product, type),
    });
  }

  async function searchMovement() {
    const referenceDoc = searchQuery.trim();

    if (!referenceDoc) {
      showFeedback({
        variant: "error",
        title: "Documento requerido",
        message: "Ingresa el documento de referencia que deseas buscar.",
      });
      return;
    }

    clearFeedback();
    clearToast();

    setSearching(true);

    try {
      const response = await fetch(
        `/api/movements/reference-doc/${encodeURIComponent(referenceDoc)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result?.message === "string"
            ? result.message
            : `No se encontró el ${movementName}.`,
        );
      }

      const movement = result as MovementDto;

      if (movement.type !== type) {
        throw new Error(
          `El documento encontrado corresponde a un movimiento de tipo ${movement.type}, no a un ${type}.`,
        );
      }

      setForm({
        documentId: "",
        partnerId: movement.partnerId,
        status: movement.status,
        referenceDoc: movement.referenceDoc,
        lines: movement.movementItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      setIsExistingMovement(true);

      showFeedback({
        variant: "success",
        title: `${movementName} encontrado`,
        message:
          "El documento se encuentra en modo consulta y no puede editarse.",
      });
    } catch (searchError) {
      setIsExistingMovement(false);

      showFeedback({
        variant: "error",
        title: `No se encontró el ${movementName}`,
        message:
          searchError instanceof Error
            ? searchError.message
            : `No se pudo buscar el ${movementName}.`,
      });
    } finally {
      setSearching(false);
    }
  }

  function handleClone() {
    showFeedback({
      variant: "info",
      title: "Clonar documento",
      message:
        "Esta función permitirá clonar una orden existente para evitar crear órdenes similares. Se encuentra pendiente de desarrollo.",
    });
  }

  async function saveMovement() {
    if (isExistingMovement) {
      return;
    }

    clearFeedback();
    clearToast();

    const documentId = form.documentId.trim();
    const partnerId = form.partnerId.trim();
    const referenceDoc = form.referenceDoc.trim();

    if (!documentId) {
      showFeedback({
        variant: "error",
        title: "Número de documento requerido",
        message: `Ingresa el número de documento antes de guardar el ${movementName}.`,
      });
      return;
    }

    if (!partnerId) {
      showFeedback({
        variant: "error",
        title: `${partnerLabel} requerido`,
        message: `Ingresa el ID del ${partnerLabel.toLowerCase()} antes de guardar el ${movementName}.`,
      });
      return;
    }

    if (!referenceDoc) {
      showFeedback({
        variant: "error",
        title: "Documento de referencia requerido",
        message: `Ingresa el documento de referencia antes de guardar el ${movementName}.`,
      });
      return;
    }

    if (form.lines.length === 0) {
      showFeedback({
        variant: "error",
        title: "Sin productos",
        message: `Debes agregar al menos un producto al ${movementName}.`,
      });
      return;
    }

    const invalidLine = form.lines.some(
      (line) =>
        !line.productId ||
        !Number.isInteger(line.quantity) ||
        line.quantity <= 0 ||
        !Number.isFinite(line.unitPrice) ||
        line.unitPrice < 0,
    );

    if (invalidLine) {
      showFeedback({
        variant: "error",
        title: "Revisa los productos",
        message:
          "Cada producto debe tener una cantidad válida y un precio unitario mayor o igual a cero.",
      });
      return;
    }

    const payload: CreateMovementDto = {
      type,
      documentId,
      partnerId,
      referenceDoc,
      status: form.status,
      movementItems: form.lines.map((line) => ({
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
      })),
    };

    setSaving(true);

    try {
      const response = await fetch("/api/movements", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result?.message === "string"
            ? result.message
            : `No se pudo registrar el ${movementName}.`,
        );
      }

      const movement = result as MovementDto;

      showFeedback({
        variant: "success",
        title: successTitle,
        message: `${successMessage} Total: ${currency.format(
          movement.totalAmount,
        )}.`,
      });

      setForm(createInitialForm(products, type));
      setSearchQuery("");
      setIsExistingMovement(false);
    } catch (saveError) {
      showFeedback({
        variant: "error",
        title: `No se pudo registrar el ${movementName}`,
        message:
          saveError instanceof Error
            ? saveError.message
            : `Ocurrió un error al guardar el ${movementName}.`,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {toast && (
        <Toast
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          onClose={clearToast}
        />
      )}

      <div className="content-wrap">
        <Heading
          eyebrow={`Movimientos · ${type === "INGRESO" ? "Ingreso" : "Egreso"}`}
          title={documentTitle}
          description={documentDescription}
        />

        {feedback && (
          <div ref={feedbackRef}>
            <FeedbackMessage
              variant={feedback.variant}
              title={feedback.title}
              message={feedback.message}
              onClose={clearFeedback}
            />
          </div>
        )}

        <MovementSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={() => void searchMovement()}
          onNew={resetForm}
          onClone={handleClone}
          loading={searching}
          disabled={saving}
          hasExistingMovement={isExistingMovement}
          movementName={movementName}
        />

        <div className="movement-layout">
          <MovementDocumentForm
            form={form}
            type={type}
            documentLabel={documentLabel}
            partnerLabel={partnerLabel}
            title={movementTitle}
            description={movementDescription}
            disabled={saving || isExistingMovement}
            onChange={updateDocument}
          />

          <MovementItems
            lines={form.lines}
            products={products}
            total={total}
            saving={saving}
            readOnly={isExistingMovement}
            type={type}
            onAdd={addLine}
            onRemove={removeLine}
            onProductChange={changeProduct}
            onLineChange={updateLine}
            onSave={() => void saveMovement()}
            onReset={resetForm}
            saveLabel={saveLabel}
          />
        </div>
      </div>
    </>
  );
}
