<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Manage Events</h1>
      <UButton
        icon="i-heroicons-plus-circle"
        to="/staff/dashboard/create"
        label="Create New Event"
        size="sm"
      />
    </div>
    <EventList />
  </div>
</template>

<script setup lang="ts">
import EventList from "~/components/events/EventList.vue";

definePageMeta({
  layout: "staff",
  middleware: "staff-auth",
});
</script>
