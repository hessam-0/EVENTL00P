// middleware/staff-auth.ts
import { useAuth } from "#imports";

export default defineNuxtRouteMiddleware((to) => {
  const { status, data: session } = useAuth();

  if (status.value === "loading") {
    return; // Wait for auth status to resolve.
  }

  if (status.value === "authenticated") {
    if (session.value?.user?.role === "staff") {
      return; // Authenticated staff, allow access.
    } else {
      // Authenticated non-staff, redirect.
      return navigateTo("/");
      // Alternative: return abortNavigation(createError({ statusCode: 403, message: 'Forbidden' }));
    }
  }

  if (status.value === "unauthenticated") {
    // Prevent redirect loop if already going to login.
    if (to.path !== "/login") {
      return navigateTo("/login");
    }
    return;
  }

  // Fallback for unexpected states: redirect to login.
  if (to.path !== "/login") {
    return navigateTo("/login");
  }
  return;
});
