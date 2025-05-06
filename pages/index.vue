<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center p-4 dark:bg-gray-900"
  >
    <img
      src="/images/eventloop_logo.png"
      alt="EventLoop Logo"
      class="w-64 md:w-62 mb-4"
    />
    <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
      Keep In the Loop with the Tech Scene
    </p>

    <div class="flex flex-col sm:flex-row gap-4 sm:justify-center">
      <template v-if="!isAuthenticated">
        <UButton
          to="/login"
          label="Login"
          size="lg"
          variant="outline"
          icon="i-heroicons-arrow-right-start-on-rectangle"
          class="w-full sm:w-auto sm:min-w-[10rem]"
        />
        <UButton
          to="/register"
          label="Sign Up"
          size="lg"
          icon="i-heroicons-user-plus"
          class="w-full sm:w-auto sm:min-w-[10rem]"
        />
      </template>
      <UButton
        to="/events"
        label="Browse Events"
        size="lg"
        icon="i-heroicons-calendar-days"
        trailing
        class="w-full sm:w-auto sm:min-w-[10rem]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuth } from "#imports";

const { status } = useAuth();
const isAuthenticated = computed(() => status.value === "authenticated");

definePageMeta({
  layout: "home",
});
</script>
