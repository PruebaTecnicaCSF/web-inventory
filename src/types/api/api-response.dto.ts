export interface PaginationMetaDto {
  total: number;
  page: number;
  lastPage: number;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto;
}