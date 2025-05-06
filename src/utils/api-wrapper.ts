/* eslint-disable @typescript-eslint/no-explicit-any */
import { addToast } from "@heroui/react";

export type ApiResponse<T> = {
  data: T;
  error: string | null;
};

// Keep track of shown error messages to prevent duplicates
const shownErrors = new Set<string>();

// Clear error messages after a delay
const clearErrorAfterDelay = (errorKey: string) => {
  setTimeout(() => {
    shownErrors.delete(errorKey);
  }, 5000); // Clear after 5 seconds
};

export async function clientApiCall<T>(
  promise: Promise<T>,
  fallback: T,
  showSuccessMessage = true, // Default to true since most actions need feedback
  options?: {
    handleError?: (error: string) => void;
  }
): Promise<T> {
  try {
    let result = await promise;
    // Handle message and data stripping
    if (result && typeof result === "object") {
      const { message, ...rest } = result as any;

      // Only strip and transform if there was actually a message property
      if (message !== undefined) {
        const values = Object.values(rest);
        result = values.length === 1 ? values[0] : rest;

        // Show success message if enabled and message exists
        if (showSuccessMessage && message) {
          addToast({
            title: "Success",
            description: message,
            color: "success",
          });
        }
      } else {
        // If no message property, keep the original result
        result = result as any;
      }
    }

    return result;
  } catch (error: any) {
    console.log("API ERROR", error);
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "Something went wrong";

    // Only show toast if this exact error hasn't been shown recently
    if (!shownErrors.has(message)) {
      shownErrors.add(message);
      addToast({
        title: "Error",
        description: message,
        color: "danger",
      });
      clearErrorAfterDelay(message);
    }

    // Call error handler if provided
    if (options?.handleError) {
      options.handleError(message);
    }

    return fallback;
  }
}

export async function serverApiCall<T>(
  promise: Promise<T>,
  fallback: T
): Promise<ApiResponse<T>> {
  try {
    let data = await promise;

    // Strip out message from the result
    if (data && typeof data === "object") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message, ...rest } = data as any;
      const values = Object.values(rest);
      data = values.length === 1 ? values[0] : rest;
    }

    return { data, error: null };
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return { data: fallback, error: message };
  }
}
