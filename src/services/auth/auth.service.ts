import { apiClient } from "@/src/services/api/api-client";
import type { LoginDto, LoginResponseDto } from "@/src/types/auth/auth.dto";

export async function login(credentials: LoginDto): Promise<LoginResponseDto> {
  return apiClient<LoginResponseDto>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
