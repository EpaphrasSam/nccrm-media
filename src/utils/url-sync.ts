/* eslint-disable @typescript-eslint/no-explicit-any */
export const urlSync = {
  pushToUrl: (params: Record<string, any>) => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);

    // If params is empty, clear all parameters
    if (Object.keys(params).length === 0) {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname
      );
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

    // Only call replaceState if the URL actually changes
    const currentUrlPath = `${window.location.pathname}${window.location.search}`;
    if (newUrl !== currentUrlPath) {
      // For Next.js, we need to update the internal routing state
      const newState = { ...window.history.state };
      if (newState.__PRIVATE_NEXTJS_INTERNALS_TREE) {
        // Update the Next.js internal page state
        const tree = newState.__PRIVATE_NEXTJS_INTERNALS_TREE;
        if (tree[1]?.children?.[1]?.children?.[1]?.children?.[0]) {
          tree[1].children[1].children[1].children[0] = `__PAGE__?${new URLSearchParams(
            newUrl.split("?")[1] || ""
          ).toString()}`;
          tree[1].children[1].children[1].children[2] = newUrl;
        }
      }
      window.history.replaceState(newState, "", newUrl);
    }
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
