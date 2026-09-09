export interface ProductDto {
  id: string;
  name: string;
  unitPrice: number;
  lastCostPrice?: number;
  stock: number;
  rowStatus?: boolean;
  createdAt?: string;
  updatedAt?: string;
}