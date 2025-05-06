import type { NavigationGuard } from "#app";

type CustomMiddlewareKey = "staff-auth";
declare module "#app" {
  interface PageMeta {
    middleware?:
      | CustomMiddlewareKey
      | NavigationGuard
      | (CustomMiddlewareKey | NavigationGuard)[];
  }
}
export {};
