import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

let routerInstance: AppRouterInstance | null = null;

export type NavigateOptions = {
  replace?: boolean;
};

export const navigationService = {
  init: (router: AppRouterInstance) => {
    routerInstance = router;
  },

  navigate: (path: string, options?: NavigateOptions) => {
    if (routerInstance) {
      if (options?.replace) {
        routerInstance.replace(path);
      } else {
        routerInstance.push(path);
      }
    } else {
      if (options?.replace) {
        window.location.replace(path);
      } else {
        window.location.href = path;
      }
    }
  },
  refresh: () => {
    if (routerInstance) {
      routerInstance.refresh();
    } else {
      window.location.reload();
    }
  },

  // Utility method for cases where you specifically want to replace
  replace: (path: string) => {
    navigationService.navigate(path, { replace: true });
  },
};
