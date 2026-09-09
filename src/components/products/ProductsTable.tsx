"use client";

import {
    ChevronLeft,
    ChevronRight,
    Package,
    Search,
    Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { EmptyTable } from "@/src/components/ui/emptytable/EmptyTable";
import { FeedbackMessage } from "@/src/components/ui/feedback/FeedbackMessage";
import { Toast } from "@/src/components/ui/feedback/Toast";

import type { PaginatedResponseDto } from "@/src/types/api/api-response.dto";
import type { ProductDto } from "@/src/types/products/product.dto";

interface ProductsTableProps {
  data: PaginatedResponseDto<ProductDto>;
}

type FeedbackState = {
  variant: "error" | "success" | "info";
  title: string;
  message: string;
} | null;

type ToastState = {
  variant: "error" | "success" | "info";
  title: string;
  message: string;
} | null;

export function ProductsTable({ data }: ProductsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tableData, setTableData] = useState(data);
  const [searchId, setSearchId] = useState("");
  const [searching, setSearching] = useState(false);

  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const currency = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  });

  const number = new Intl.NumberFormat("es-PE");

  function showFeedback(
    variant: "error" | "success" | "info",
    title: string,
    message: string,
  ) {
    setFeedback({
      variant,
      title,
      message,
    });

    setToast({
      variant,
      title,
      message,
    });
  }

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = searchId.trim();

    if (!id) {
      showFeedback(
        "error",
        "ID requerido",
        "Ingresa el ID del producto que deseas buscar.",
      );
      return;
    }

    setFeedback(null);
    setToast(null);
    setSearching(true);

    try {
      const response = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result?.message === "string"
            ? result.message
            : "No se encontró el producto.",
        );
      }

      const productResponse = result as PaginatedResponseDto<ProductDto>;

      setTableData(productResponse);

      showFeedback(
        "success",
        "Producto encontrado",
        "El producto fue cargado correctamente.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo buscar el producto.";

      setTableData({
        data: [],
        meta: {
          total: 0,
          page: 1,
          lastPage: 1,
        },
      });

      showFeedback("error", "No se pudo encontrar el producto", message);
    } finally {
      setSearching(false);
    }
  }

  function handleClearSearch() {
    setSearchId("");
    setFeedback(null);
    setToast(null);
    setTableData(data);
  }

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));

    router.push(`/products?${params.toString()}`);
  }

  function handlePreviousPage() {
    if (tableData.meta.page <= 1) {
      return;
    }

    handlePageChange(tableData.meta.page - 1);
  }

  function handleNextPage() {
    if (tableData.meta.page >= tableData.meta.lastPage) {
      return;
    }

    handlePageChange(tableData.meta.page + 1);
  }

  function handleDelete(productId: string) {
    console.log("Pendiente implementar DELETE:", productId);

    showFeedback(
      "info",
      "Función pendiente",
      "La eliminación de productos todavía no está implementada.",
    );
  }

  const { data: products, meta } = tableData;

  return (
    <>
      {toast && (
        <Toast
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <section className="panel table-panel">
        <div className="table-toolbar">
          <form className="product-search" onSubmit={handleSearch}>
            <div className="search-box product-search-input">
              <Search />

              <input
                type="text"
                placeholder="Buscar por ID del producto..."
                value={searchId}
                onChange={(event) => {
                  setSearchId(event.target.value);

                  if (feedback) {
                    setFeedback(null);
                  }
                }}
                disabled={searching}
              />
            </div>

            <button
              type="submit"
              className="secondary-button"
              disabled={searching}
            >
              <Search />

              {searching ? "Buscando..." : "Buscar"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={handleClearSearch}
              disabled={searching || !searchId}
            >
              Limpiar
            </button>
          </form>
        </div>

        {feedback && (
          <div className="table-feedback">
            <FeedbackMessage
              variant={feedback.variant}
              title={feedback.title}
              message={feedback.message}
              onClose={() => setFeedback(null)}
            />
          </div>
        )}

        <EmptyTable>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock</th>
              <th>Precio unitario</th>
              <th>Estado</th>
              <th>
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  {feedback?.variant === "error"
                    ? "No se encontró ningún producto con ese ID."
                    : "No se encontraron productos."}
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="table-product">
                      <div className="product-avatar">
                        <Package />
                      </div>

                      <div>
                        <strong>{product.name}</strong>
                        <span>{product.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <strong>{number.format(product.stock)}</strong> und.
                  </td>

                  <td>{currency.format(product.unitPrice)}</td>

                  <td>
                    <span
                      className={`status ${
                        product.rowStatus ? "status-green" : "status-orange"
                      }`}
                    >
                      <i />
                      {product.rowStatus ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="icon-button danger-hover"
                      onClick={() => handleDelete(product.id)}
                      aria-label={`Eliminar ${product.name}`}
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </EmptyTable>

        <div className="table-footer">
          <span>
            Mostrando {products.length} de {meta.total} productos
          </span>

          <div className="pagination">
            <button
              type="button"
              className="icon-button"
              aria-label="Página anterior"
              disabled={meta.page <= 1}
              onClick={handlePreviousPage}
            >
              <ChevronLeft />
            </button>

            {Array.from(
              {
                length: meta.lastPage,
              },
              (_, index) => index + 1,
            ).map((page) => (
              <button
                type="button"
                key={page}
                className={`page-number ${meta.page === page ? "active" : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="icon-button"
              aria-label="Página siguiente"
              disabled={meta.page >= meta.lastPage}
              onClick={handleNextPage}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
