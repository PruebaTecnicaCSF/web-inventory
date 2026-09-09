import { getAccessToken } from "@/src/lib/auth/session";
import { apiClient } from "@/src/services/api/api-client";
import { PaginatedResponseDto } from "@/src/types/api/api-response.dto";
import { RegisterUserDto, RegisterUserResponseDto, UserDto } from "@/src/types/users/user.dto";

export async function getUsers(): Promise<PaginatedResponseDto<UserDto>> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No autenticado.");
  }

  return apiClient<PaginatedResponseDto<UserDto>>("/users", {
    token,
  });
}

export async function registerUser(
  payload: RegisterUserDto,
): Promise<RegisterUserResponseDto> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No autenticado.");
  }

  return apiClient<RegisterUserResponseDto>("/auth/register", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}
