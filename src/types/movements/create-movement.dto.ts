export type MovementType = "INGRESO" | "EGRESO";

export type MovementStatus =
  | "PAGADA"
  | "PENDIENTE"
  | "ANULADA";

export interface CreateMovementItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateMovementDto {
  type: MovementType;
  documentId: string;
  partnerId: string;
  referenceDoc: string;
  status: MovementStatus;
  movementItems: CreateMovementItemDto[];
}