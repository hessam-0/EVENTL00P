<template>
  <nav class="space-y-1">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="flex items-center px-3 py-2 text-sm font-medium rounded-md group"
      active-class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
      inactive-class="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      @click="closeMenu"
    >
      <UIcon :name="link.icon" class="mr-3 h-5 w-5 flex-shrink-0" />
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const emit = defineEmits(["closeMobileMenu"]);

const closeMenu = () => {
  emit("closeMobileMenu");
};

const links = [
  {
    label: "Manage Events",
    icon: "i-heroicons-calendar-days",
    to: "/staff/dashboard/events",
  },
  {
    label: "Create Event",
    icon: "i-heroicons-plus-circle",
    to: "/staff/dashboard/create",
  },
];
</script>
