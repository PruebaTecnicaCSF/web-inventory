"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="panel table-panel">
      <h2>No se pudieron cargar los productos.</h2>

      <button
        type="button"
        className="secondary-button"
        onClick={() => reset()}
      >
        Reintentar
      </button>
    </section>
  );
}
