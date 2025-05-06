<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Edit Event</h1>

    <div v-if="pending" class="text-center py-10">
      <p>Loading event details...</p>
      <USkeleton class="h-12 w-full mt-4" />
      <USkeleton class="h-8 w-3/4 mt-2" />
      <USkeleton class="h-8 w-1/2 mt-2" />
    </div>

    <UAlert
      v-else-if="error"
      color="red"
      variant="subtle"
      title="Error Loading Event"
      icon="i-heroicons-exclamation-triangle"
      class="mt-4"
    >
      <template #description>
        <p>
          Could not fetch the event data. It might not exist or there was a
          server issue.
        </p>
        <pre v-if="error" class="mt-2 text-xs whitespace-pre-wrap">{{
          error.message || error
        }}</pre>
        <UButton label="Back to Events" to="/staff/dashboard" class="mt-4" />
      </template>
    </UAlert>

    <EventForm v-else-if="eventData" :event-to-edit="eventData" />

    <div v-else class="text-center py-10 text-gray-500">
      <p>Event data could not be loaded.</p>
      <UButton label="Back to Events" to="/staff/dashboard" class="mt-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "@prisma/client";
import { useFetch, useRoute } from "#imports";
import EventForm from "~/components/staff/EventForm.vue";

definePageMeta({
  layout: "staff",
  middleware: "staff-auth",
});

const route = useRoute();
const eventId = route.params.id as string;

const {
  data: eventData,
  pending,
  error,
} = await useFetch<Event>(`/api/events/${eventId}`, {
  key: `event-${eventId}`,
});
</script>
