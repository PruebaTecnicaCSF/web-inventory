"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { CreateProductModal } from "@/src/components/products/CreateProductModal";

export function CreateProductButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCreated() {
    window.location.reload();
  }

  return (
    <>
      <button
        type="button"
        className="primary-button"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus />
        Nuevo producto
      </button>

      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
