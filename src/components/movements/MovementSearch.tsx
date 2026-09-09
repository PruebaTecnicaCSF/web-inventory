"use client";

import { Copy, Plus, Search } from "lucide-react";

interface MovementSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onNew: () => void;
  onClone: () => void;
  loading: boolean;
  disabled: boolean;
  hasExistingMovement: boolean;
  movementName: string;
}

export function MovementSearch({
  value,
  onChange,
  onSearch,
  onNew,
  onClone,
  loading,
  disabled,
  hasExistingMovement,
  movementName,
}: MovementSearchProps) {
  const isDisabled = loading || disabled;

  return (
    <section className="panel movement-orders">
      <div className="table-toolbar">
        <div>
          <h2>Órdenes de {movementName}</h2>

          <p className="heading-description">
            Busca una {movementName.toLowerCase()} existente o crea una nueva.
          </p>
        </div>

        <div className="order-search">
          <div className="search-box">
            <Search />

            <input
              type="text"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSearch();
                }
              }}
              placeholder="Buscar por documento de referencia..."
              disabled={isDisabled}
            />
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={onSearch}
            disabled={isDisabled}
          >
            <Search />

            {loading ? "Buscando..." : "Buscar"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={onNew}
            disabled={isDisabled}
          >
            <Plus />
            Nuevo
          </button>

          <button
            type="button"
            className={
              hasExistingMovement
                ? "primary-button clone-button"
                : "secondary-button clone-button"
            }
            onClick={onClone}
            disabled={isDisabled || !hasExistingMovement}
          >
            <Copy />
            Clonar documento
          </button>
        </div>
      </div>

      <div className="order-results">
        {hasExistingMovement ? (
          <span>{movementName} encontrada · modo consulta</span>
        ) : (
          <span>Busca por documento de referencia.</span>
        )}
      </div>
    </section>
  );
}
