import { getAccessToken } from "@/src/lib/auth/session";
import { apiClient } from "@/src/services/api/api-client";

import type { CreateMovementDto } from "@/src/types/movements/create-movement.dto";
import type { MovementDto } from "@/src/types/movements/movement.dto";

export async function createMovement(
  payload: CreateMovementDto,
): Promise<MovementDto> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No autenticado.");
  }

  return apiClient<MovementDto>("/movements", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getMovementByDocumentId(
  documentId: string,
): Promise<MovementDto> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No autenticado.");
  }

  const params = new URLSearchParams({
    documentId,
  });

  return apiClient<MovementDto>(
    `/movements?${params.toString()}`,
    {
      method: "GET",
      token,
    },
  );
}

export async function getMovementByReferenceDoc(
  referenceDoc: string,
): Promise<MovementDto> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No autenticado.");
  }

  return apiClient<MovementDto>(
    `/movements/reference-doc/${encodeURIComponent(
      referenceDoc,
    )}`,
    {
      token,
    },
  );
}