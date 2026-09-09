import type {
    MovementStatus,
    MovementType,
} from "@/src/types/movements/create-movement.dto";

export interface MovementItemDto {
  id: string;
  movementId: string;
  unitPrice: number;
  quantity: number;
  productId: string;
  productName: string | null;
}

export interface MovementDto {
  id: string;
  type: MovementType;
  referenceDoc: string;
  partnerId: string;
  status: MovementStatus;
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  movementItems: MovementItemDto[];
}