/* eslint-disable @typescript-eslint/no-explicit-any */
const isServer = typeof window === "undefined";
export const BASE_URL = isServer
  ? process.env.SERVER_API_URL || ""
  : process.env.NEXT_PUBLIC_API_URL || "";
export const authUrl =
  process.env.AUTH_URL || process.env.NEXT_PUBLIC_AUTH_URL || "";

console.log("BASE_URL", BASE_URL);
console.log("authUrl", authUrl);

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
  returnErrorStatus?: boolean;
}

interface FetchResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
}

interface FetchError extends Error {
  status?: number;
  data?: any;
  response?: { status: number };
}

async function signOut() {
  try {
    const signOutUrl = "/api/auth/signout";
    await fetch(signOutUrl, { method: "POST" });

    // The middleware will handle the redirect, but just in case
    window.location.href = "/login";
  } catch (error) {
    console.error("Error during sign out:", error);
    // Fallback redirect
    // window.location.href = "/login";
  }
}

function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Invalid request. Please check your data and try again.";
    case 401:
      return "Unauthorized. Please log in and try again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 405:
      return "This action is not allowed.";
    case 408:
      return "Request timeout. Please try again.";
    case 409:
      return "This operation conflicts with another request.";
    case 422:
      return "Invalid data provided. Please check your input.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
      return "Internal server error. Please try again later.";
    case 502:
      return "Server is temporarily unavailable. Please try again later.";
    case 503:
      return "Service unavailable. Please try again later.";
    default:
      return status >= 500
        ? "Server error. Please try again later."
        : "Something went wrong. Please try again.";
  }
}

async function getAuthSession() {
  try {
    const sessionUrl = "/api/auth/session";
    const session = await fetch(sessionUrl).then((res) => res.json());
    return session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

function createUrl(url: string, params?: Record<string, any>): string {
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
  if (!params) return fullUrl;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${fullUrl}?${queryString}` : fullUrl;
}

async function customFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResponse<T>> {
  try {
    const { params, headers: customHeaders, body, ...rest } = options;
    const session = await getAuthSession();

    console.log("Session", session);

    // Construct headers
    const headers = new Headers(customHeaders);

    // Don't set Content-Type for FormData, let the browser handle it
    if (!headers.has("Content-Type") && !(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    if (session?.user?.token) {
      headers.set("Authorization", session.user.token);
    }

    // If it's FormData, remove any Content-Type header to let browser set it
    if (body instanceof FormData) {
      headers.delete("Content-Type");
    }

    // Make the request
    const response = await fetch(createUrl(url, params), {
      ...rest,
      headers,
      body:
        body instanceof FormData
          ? body
          : body
          ? JSON.stringify(body)
          : undefined,
    });

    // Parse response
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.log("RESPONSE NOT OK", response);
      const error = new Error() as FetchError;
      error.status = response.status;
      error.data = data;
      error.response = {
        status: response.status,
      };

      // Get error message from response or use default
      const errorMessage =
        data?.error?.message || // Check for error message in response
        data?.message || // Check for message in response
        (typeof data === "string" ? data : null) || // Use data if it's a string
        getDefaultErrorMessage(response.status); // Use default message based on status

      error.message = errorMessage;

      if (response.status === 408) {
        await signOut();
      }

      if (options.returnErrorStatus) {
        throw error;
      }

      // Otherwise throw just the message
      const messageError = new Error(error.message);
      throw messageError;
    }

    return {
      data,
      status: response.status,
      ok: response.ok,
    };
  } catch (error: any) {
    console.log("FETCH ERROR", error);
    // Handle network errors or other non-HTTP errors
    if (!error.status) {
      error.message =
        error.message || "Network error. Please check your connection.";
      error.status = 0;
    }

    // Preserve the original error structure if it exists
    if (!error.response && error.status) {
      error.response = {
        status: error.status,
      };
    }

    if (options.returnErrorStatus) {
      // Ensure we preserve the full error structure
      if (error.data?.error) {
        error.response = error.data.error;
      }
      throw error;
    }

    // Otherwise throw just the message
    const messageError = new Error(error.message);
    throw messageError;
  }
}

export const fetchClient = {
  get: <T>(url: string, options: FetchOptions = {}) =>
    customFetch<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, data?: any, options: FetchOptions = {}) =>
    customFetch<T>(url, { ...options, method: "POST", body: data }),

  put: <T>(url: string, data?: any, options: FetchOptions = {}) =>
    customFetch<T>(url, { ...options, method: "PUT", body: data }),

  delete: <T>(url: string, options: FetchOptions = {}) =>
    customFetch<T>(url, { ...options, method: "DELETE" }),
};
