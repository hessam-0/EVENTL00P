// middleware/auth.ts
import { useAuth } from "#imports";

export default defineNuxtRouteMiddleware((to) => {
  // Client-side only for reliable auth status and redirection.
  if (process.server) {
    return;
  }

  const { status } = useAuth();

  if (status.value === "loading") {
    return; // Auth status is resolving, wait for re-evaluation.
  }

  if (status.value === "unauthenticated") {
    // Prevent redirect loop if already navigating to login.
    if (to.path !== "/login") {
      const redirectTo = to.fullPath !== "/" ? to.fullPath : undefined;
      return navigateTo({ path: "/login", query: { redirect: redirectTo } });
    }
    return;
  }

  if (status.value === "authenticated") {
    return; // Allow access.
  }

  // Fallback for any unexpected auth status.
  if (to.path !== "/login") {
    return navigateTo("/login");
  }
  return;
});
