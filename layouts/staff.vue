<template>
  <div class="staff-layout flex flex-col min-h-screen">
    <header
      class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0"
    >
      <!-- mobile menu toggle button -->
      <UButton
        icon="i-heroicons-bars-3"
        variant="ghost"
        color="gray"
        aria-label="Toggle Menu"
        class="md:hidden"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      />
      <div class="text-lg font-semibold text-gray-900 dark:text-white">
        EventLoop Staff
      </div>
      <UButton
        variant="ghost"
        color="gray"
        icon="i-heroicons-arrow-left-on-rectangle"
        @click="handleLogout"
        >Logout</UButton
      >
    </header>

    <div class="flex flex-grow overflow-hidden">
      <aside
        class="fixed inset-y-0 left-0 z-40 w-64 flex-shrink-0 bg-gray-100 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-transform duration-300 ease-in-out transform -translate-x-full md:relative md:inset-auto md:z-auto md:translate-x-0"
        :class="{ 'translate-x-0': isMobileMenuOpen }"
      >
        <StaffSidebar @close-mobile-menu="isMobileMenuOpen = false" />
      </aside>
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        @click="isMobileMenuOpen = false"
        aria-hidden="true"
      ></div>

      <main class="flex-grow p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <div class="bg-white dark:bg-gray-950 rounded-lg shadow p-6">
          <NuxtPage />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth, navigateTo } from "#imports";
import StaffSidebar from "~/components/staff/StaffSidebar.vue";
import { ref, onMounted } from "vue";

const isMobileMenuOpen = ref(false);
const { signOut } = useAuth();

const handleLogout = async () => {
  console.log("Logging out...");
  try {
    await signOut({ callbackUrl: "/login" });
    console.log("Logout successful, redirecting...");
  } catch (error) {
    console.error("Error during logout:", error);
    await navigateTo("/login");
  }
};
</script>

<style scoped>
.staff-layout {
  /* Ensure it takes full viewport height */
}
</style>
