import { getAccessToken } from "@/src/lib/auth/session";
import { apiClient } from "@/src/services/api/api-client";

import type { PaginatedResponseDto } from "@/src/types/api/api-response.dto";
import type { CreateProductDto } from "@/src/types/products/create-product.dto";
import type { ProductDto } from "@/src/types/products/product.dto";

export interface GetProductsParams {
  page?: number;
  limit?: number;
}

export async function getProducts(
  params: GetProductsParams = {},
): Promise<PaginatedResponseDto<ProductDto>> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No autenticado.");
  }

  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  return apiClient<PaginatedResponseDto<ProductDto>>(
    `/products${query ? `?${query}` : ""}`,
    {
      token,
    },
  );
}

export async function getProductById(
  id: string,
): Promise<PaginatedResponseDto<ProductDto>> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No autenticado.");
  }

  return apiClient<PaginatedResponseDto<ProductDto>>(
    `/products/${encodeURIComponent(id)}`,
    {
      token,
    },
  );
}

export async function createProduct(
  payload: CreateProductDto,
): Promise<ProductDto> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No autenticado.");
  }

  return apiClient<ProductDto>("/products", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}