<template>
  <div class="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Navbar -->
    <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <UContainer>
        <nav class="flex items-center justify-between h-16">
          <!-- Logo/Title -->
          <NuxtLink
            to="/"
            class="text-xl font-bold text-gray-900 dark:text-white"
          >
            EventLoop
          </NuxtLink>

          <div class="flex items-center space-x-4">
            <UButton to="/events" variant="ghost" color="gray">Events</UButton>

            <UButton v-if="!isStaff" to="/account" variant="ghost" color="gray">
              Account
            </UButton>

            <UButton
              v-if="isStaff"
              to="/staff/dashboard"
              variant="ghost"
              color="gray"
            >
              Dashboard
            </UButton>

            <UButton
              v-if="!isAuthenticated"
              to="/login"
              variant="outline"
              color="primary"
            >
              Login
            </UButton>
            <UButton
              v-if="isAuthenticated"
              @click="handleLogout"
              variant="outline"
              color="primary"
            >
              Logout
            </UButton>
          </div>
        </nav>
      </UContainer>
    </header>

    <!-- Page Content -->
    <main class="flex-grow">
      <NuxtPage />
    </main>

    <footer class="bg-gray-200 dark:bg-gray-800 py-4">
      <UContainer>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          © {{ new Date().getFullYear() }} EventLoop Community.
        </p>
      </UContainer>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuth } from "#imports";

const { status, data, signOut } = useAuth();

const isAuthenticated = computed(() => status.value === "authenticated");
const isStaff = computed(() => data.value?.user?.role === "staff");
const handleLogout = async () => {
  await signOut({ callbackUrl: "/" });
};
</script>
