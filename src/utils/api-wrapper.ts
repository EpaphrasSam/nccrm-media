import { addToast } from "@heroui/react";

export type ApiResponse<T> = {
  data: T;
  error: string | null;
};

export async function clientApiCall<T>(
  promise: Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await promise;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    addToast({
      title: "Error",
      description: message,
      color: "danger",
    });
    return fallback;
  }
}

export async function serverApiCall<T>(
  promise: Promise<T>,
  fallback: T
): Promise<ApiResponse<T>> {
  try {
    const data = await promise;
    return { data, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return { data: fallback, error: message };
  }
}
