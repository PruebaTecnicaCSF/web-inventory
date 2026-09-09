export interface KardexItemDto {
  id: string;
  productId: string;
  date: string;
  concept: string;
  movementId: string;
  type: string;
  qty: number;
  price: number;
  balanceQty: number;
  balanceVal: number;
}

export interface KardexPaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface KardexResponseDto {
  data: KardexItemDto[];
  meta: KardexPaginationMetaDto;
}