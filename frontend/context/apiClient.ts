// src/lib/apiClient.ts
import Cookies from "js-cookie";

export const API_BASE_URL =
  process.env.NODE_ENV == "development"
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;

// Helper to get headers with the access token attached from cookies using js-cookie
const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = Cookies.get("jwt") || Cookies.get("accessToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Queueing mechanism to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

async function handleResponse<T>(
  response: Response,
  endpoint: string,
  options: RequestInit,
  originalFetch: typeof fetch,
): Promise<T> {
  if (
    response.status === 401 &&
    !endpoint.includes("/refresh") &&
    !endpoint.includes("/login")
  ) {
    if (typeof window === "undefined") {
      throw new Error("Unauthorized");
    }

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const storedRefreshToken = Cookies.get("refreshToken");

        const refreshResponse = await originalFetch(`${API_BASE_URL}/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: storedRefreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error("Refresh token expired or invalid");
        }

        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.accessToken;
        const newRefreshToken = refreshData.refreshToken;

        if (!newAccessToken) {
          throw new Error("No access token received from refresh route");
        }

        // Save new tokens using js-cookie with strict matching parameters
        Cookies.set("jwt", newAccessToken, {
          expires: 1,
          path: "/",
          sameSite: "lax",
        });
        Cookies.set("accessToken", newAccessToken, {
          expires: 1,
          path: "/",
          sameSite: "lax",
        });
        if (newRefreshToken) {
          Cookies.set("refreshToken", newRefreshToken, {
            expires: 7,
            path: "/",
            sameSite: "lax",
          });
        }

        isRefreshing = false;
        onRefreshed(newAccessToken);

        const newHeaders = {
          ...(options.headers as Record<string, string>),
          Authorization: `Bearer ${newAccessToken}`,
        };

        const retryResponse = await originalFetch(
          `${API_BASE_URL}${endpoint}`,
          {
            ...options,
            headers: newHeaders,
          },
        );

        if (!retryResponse.ok) {
          const errorBody = await retryResponse.text();
          throw new Error(
            errorBody || `API error: ${retryResponse.statusText}`,
          );
        }

        const text = await retryResponse.text();
        return text ? JSON.parse(text) : (null as T);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];

        // Clear session cookies and redirect to login if refresh fails
        Cookies.remove("jwt", { path: "/" });
        Cookies.remove("accessToken", { path: "/" });
        Cookies.remove("refreshToken", { path: "/" });
        window.location.href = "/login";
        throw refreshError;
      }
    }

    return new Promise((resolve, reject) => {
      subscribeTokenRefresh(async (token: string) => {
        try {
          const newHeaders = {
            ...(options.headers as Record<string, string>),
            Authorization: `Bearer ${token}`,
          };
          const retryResponse = await originalFetch(
            `${API_BASE_URL}${endpoint}`,
            {
              ...options,
              headers: newHeaders,
            },
          );
          const text = await retryResponse.text();
          resolve(text ? JSON.parse(text) : (null as T));
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `API error: ${response.statusText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : (null as T);
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const options: RequestInit = {
      method: "GET",
      headers: getHeaders(),
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return handleResponse<T>(response, endpoint, options, fetch);
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const options: RequestInit = {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return handleResponse<T>(response, endpoint, options, fetch);
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const options: RequestInit = {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return handleResponse<T>(response, endpoint, options, fetch);
  },

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const options: RequestInit = {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return handleResponse<T>(response, endpoint, options, fetch);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const options: RequestInit = {
      method: "DELETE",
      headers: getHeaders(),
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return handleResponse<T>(response, endpoint, options, fetch);
  },
};
