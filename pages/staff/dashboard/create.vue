<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">Create New Event</h1>
    <UCard>
      <EventForm @event-created="onEventCreated" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import EventForm from "~/components/staff/EventForm.vue";
import type { Event } from "@prisma/client";

const emit = defineEmits(["event-created"]);

definePageMeta({
  layout: "staff",
  middleware: "staff-auth",
});

const onEventCreated = (newEvent: Event | any) => {
  // Re-emit the event data upwards if the parent dashboard page needs to react
  // (e.g., to refresh an event list displayed alongside this creation form)
  emit("event-created", newEvent);
};
</script>
