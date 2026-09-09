import "server-only";

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error("API_URL no está configurada");
}

interface ApiRequestOptions extends RequestInit {
  token?: string;
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { token, headers, ...fetchOptions } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let message = `Error HTTP ${response.status}`;

    try {
      const error = (await response.json()) as ApiErrorResponse;

      if (Array.isArray(error.message)) {
        message = error.message.join(", ");
      } else if (typeof error.message === "string") {
        message = error.message;
      } else if (typeof error.error === "string") {
        message = error.error;
      }
    } catch {
      // TODO
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}
