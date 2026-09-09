import { getAccessToken } from "@/src/lib/auth/session";
import { apiClient } from "@/src/services/api/api-client";

import type { KardexResponseDto } from "@/src/types/kardex/kardex.dto";

export interface GetKardexParams {
  productId: string;
  page?: number;
  limit?: number;
}

export async function getKardexByProduct(
  params: GetKardexParams,
): Promise<KardexResponseDto> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No autenticado.");
  }

  const searchParams = new URLSearchParams();

  searchParams.set("productId", params.productId);

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  return apiClient<KardexResponseDto>(
    `/movements/kardex/by-product-id?${searchParams.toString()}`,
    {
      token,
    },
  );
}
