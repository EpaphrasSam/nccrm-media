/* eslint-disable @typescript-eslint/no-explicit-any */
export const BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://api:3035";
const authUrl =
  process.env.AUTH_URL ||
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "http://localhost:3000";

console.log("BASE_URL", BASE_URL);
console.log("authUrl", authUrl);

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

interface FetchResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
}

interface FetchError extends Error {
  status?: number;
  data?: any;
}

async function getAuthSession() {
  try {
    const sessionUrl = new URL("/api/auth/session", authUrl).toString();
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

    // Construct headers
    const headers = new Headers(customHeaders);
    if (!headers.has("Content-Type") && !(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    if (session?.user?.token) {
      headers.set("Authorization", session.user.token);
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
    const data = await (response.headers
      .get("content-type")
      ?.includes("application/json")
      ? response.json()
      : response.text());

    if (!response.ok) {
      const error = new Error("Request failed") as FetchError;
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return {
      data,
      status: response.status,
      ok: response.ok,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
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
