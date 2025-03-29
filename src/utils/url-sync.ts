/* eslint-disable @typescript-eslint/no-explicit-any */
export const urlSync = {
  pushToUrl: (params: Record<string, any>) => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);

    // If params is empty, clear all parameters
    if (Object.keys(params).length === 0) {
      window.history.pushState({}, "", window.location.pathname);
      return;
    }

    // Otherwise, update parameters as before
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") {
        searchParams.set(key, String(value));
      } else {
        searchParams.delete(key);
      }
    });

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  },

  parseFromUrl: (searchParams: URLSearchParams): Record<string, any> => {
    const params: Record<string, any> = {};

    // Only parse page and limit as numbers
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");

    if (page) params.page = Number(page);
    if (limit) params.limit = Number(limit);
    if (search) params.search = search;

    // Get other params as strings
    searchParams.forEach((value, key) => {
      if (!["page", "limit", "search"].includes(key) && value !== "all") {
        params[key] = value;
      }
    });

    return params;
  },
};
