"use client";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { EmptyTable } from "@/src/components/ui/emptytable/EmptyTable";

import type { PaginatedResponseDto } from "@/src/types/api/api-response.dto";
import type { KardexResponseDto } from "@/src/types/kardex/kardex.dto";
import type { ProductDto } from "@/src/types/products/product.dto";

interface KardexViewProps {
  products: PaginatedResponseDto<ProductDto>;
  kardex: KardexResponseDto | null;
  selectedProductId: string;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Lima",
  }).format(new Date(date));
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-PE").format(value);
}

function getPreviousBalanceQty(row: KardexResponseDto["data"][number]): number {
  if (row.type === "INGRESO") {
    return row.balanceQty - row.qty;
  }

  return row.balanceQty + row.qty;
}

function getPreviousBalanceVal(row: KardexResponseDto["data"][number]): number {
  const movementValue = row.qty * row.price;

  if (row.type === "INGRESO") {
    return row.balanceVal - movementValue;
  }

  return row.balanceVal + movementValue;
}

function getTypeLabel(type: string): string {
  if (type === "INGRESO") {
    return "Ingreso";
  }

  if (type === "EGRESO") {
    return "Salida";
  }

  return type;
}

export function KardexView({
  products,
  kardex,
  selectedProductId,
}: KardexViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedProduct = useMemo(
    () => products.data.find((product) => product.id === selectedProductId),
    [products.data, selectedProductId],
  );

  const rows = kardex?.data ?? [];
  const meta = kardex?.meta;

  function navigate(productId: string, page = 1) {
    const params = new URLSearchParams(searchParams.toString());

    if (productId) {
      params.set("productId", productId);
    } else {
      params.delete("productId");
    }

    params.set("page", String(page));

    router.push(`/kardex?${params.toString()}`);
  }

  function handleProductChange(event: React.ChangeEvent<HTMLSelectElement>) {
    navigate(event.target.value, 1);
  }

  function handleClear() {
    navigate("", 1);
  }

  function handlePreviousPage() {
    if (!meta || meta.page <= 1) {
      return;
    }

    navigate(selectedProductId, meta.page - 1);
  }

  function handleNextPage() {
    if (!meta || meta.page >= meta.lastPage) {
      return;
    }

    navigate(selectedProductId, meta.page + 1);
  }

  function handlePageChange(page: number) {
    if (!meta || page === meta.page) {
      return;
    }

    navigate(selectedProductId, page);
  }

  return (
    <section className="panel table-panel">
      <div className="kardex-filter">
        <label>
          Producto
          <div className="search-box">
            <Search />

            <select
              value={selectedProductId}
              onChange={handleProductChange}
              aria-label="Seleccionar producto"
            >
              <option value="">Selecciona un producto...</option>

              {products.data.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} · {product.id}
                </option>
              ))}
            </select>
          </div>
        </label>

        <button
          type="button"
          className="secondary-button"
          onClick={handleClear}
          disabled={!selectedProductId}
        >
          Limpiar
        </button>
      </div>

      {selectedProduct && kardex && (
        <div className="kardex-summary">
          <div>
            <span>Producto</span>

            <strong>{selectedProduct.name}</strong>
          </div>

          <div>
            <span>ID del producto</span>

            <strong>{selectedProduct.id}</strong>
          </div>

          <div>
            <span>Movimientos</span>

            <strong>{formatNumber(kardex.meta.total)}</strong>
          </div>

          {rows.length > 0 && (
            <>
              <div>
                <span>Stock actual</span>

                <strong className="blue-text">
                  {formatNumber(rows[rows.length - 1].balanceQty)} und.
                </strong>
              </div>

              <div>
                <span>Valor actual</span>

                <strong className="green-text">
                  {formatCurrency(rows[rows.length - 1].balanceVal)}
                </strong>
              </div>
            </>
          )}
        </div>
      )}

      {!selectedProductId ? (
        <div className="kardex-empty">
          <div className="kardex-empty-icon">
            <PackageSearch />
          </div>

          <strong>Selecciona un producto</strong>

          <span>
            Selecciona un producto para consultar todos sus movimientos y el
            saldo histórico del inventario.
          </span>
        </div>
      ) : rows.length === 0 ? (
        <div className="kardex-empty">
          <div className="kardex-empty-icon">
            <PackageSearch />
          </div>

          <strong>Sin movimientos</strong>

          <span>
            El producto seleccionado todavía no tiene movimientos registrados en
            el Kardex.
          </span>
        </div>
      ) : (
        <>
          <EmptyTable>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Tipo</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Stock saldo</th>
                <th>Valor saldo</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const isIncome = row.type === "INGRESO";

                const previousBalanceQty = getPreviousBalanceQty(row);

                const previousBalanceVal = getPreviousBalanceVal(row);

                const movementValue = row.qty * row.price;

                return (
                  <tr key={row.id}>
                    <td>
                      <span className="kardex-date">
                        {formatDate(row.date)}
                      </span>
                    </td>

                    <td>
                      <div className="kardex-concept">
                        <strong>{row.concept}</strong>

                        <span>{row.movementId}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`status ${
                          isIncome ? "status-green" : "status-blue"
                        }`}
                      >
                        {isIncome ? <ArrowDownToLine /> : <ArrowUpFromLine />}

                        {getTypeLabel(row.type)}
                      </span>
                    </td>

                    <td>
                      <strong className={isIncome ? "green-text" : "blue-text"}>
                        {formatNumber(row.qty)}
                      </strong>
                    </td>

                    <td>{formatCurrency(row.price)}</td>

                    <td>
                      <div className="kardex-balance">
                        <strong>{formatNumber(row.balanceQty)}</strong>

                        <span>
                          {formatNumber(previousBalanceQty)}{" "}
                          {isIncome ? "+" : "-"} {formatNumber(row.qty)}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="kardex-balance">
                        <strong>{formatCurrency(row.balanceVal)}</strong>

                        <span>
                          {formatCurrency(previousBalanceVal)}{" "}
                          {isIncome ? "+" : "-"} {formatCurrency(movementValue)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </EmptyTable>

          {meta && (
            <div className="table-footer">
              <span>
                Mostrando {rows.length} de {formatNumber(meta.total)}{" "}
                movimientos
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
                    className={`page-number ${
                      meta.page === page ? "active" : ""
                    }`}
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
          )}
        </>
      )}
    </section>
  );
}
