<template>
  <div>
    <h2>Event List</h2>

    <div v-if="status === 'pending'" class="space-y-3 mt-4">
      <USkeleton class="h-12 w-full" />
      <USkeleton class="h-12 w-full" />
      <USkeleton class="h-12 w-full" />
      <USkeleton class="h-12 w-full" />
    </div>

    <UAlert
      v-else-if="status === 'error'"
      color="red"
      variant="subtle"
      title="Error Loading Events"
      icon="i-heroicons-exclamation-triangle"
      class="mt-4"
    >
      <template #description>
        <p>Could not fetch event data. Please try again later.</p>
        <pre v-if="error" class="mt-2 text-xs whitespace-pre-wrap">{{
          error.message || error
        }}</pre>
      </template>
    </UAlert>

    <UTable
      v-else-if="status === 'success'"
      :columns="columns"
      :rows="formattedEvents"
      class="w-full mt-4"
    >
      <template #title-data="{ row }">
        <NuxtLink
          :to="`/events/${row.id}`"
          class="text-primary-500 hover:underline"
        >
          {{ row.title }}
        </NuxtLink>
      </template>

      <template #actions-data="{ row }">
        <UButton
          icon="i-heroicons-pencil-square"
          size="sm"
          square
          variant="ghost"
          :to="`/staff/dashboard/events-edit-${row.id}`"
          aria-label="Edit Event"
        />
        <UButton
          icon="i-heroicons-trash"
          size="sm"
          square
          color="red"
          variant="ghost"
          aria-label="Delete Event"
          @click="promptDelete(row.id)"
        />
      </template>

      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-10 gap-3">
          <UIcon
            name="i-heroicons-circle-stack-20-solid"
            class="w-10 h-10 text-gray-400"
          />
          <span class="italic text-sm text-gray-500">No events found.</span>
          <UButton
            label="Create New Event"
            icon="i-heroicons-plus"
            to="/staff/dashboard/create"
            size="sm"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import { type Event, type Staff } from "@prisma/client";
import { computed } from "vue";
import { useToast } from "#imports";
import { format } from "date-fns";
import { formatDisplayDateTime } from "~/utils/dateFormatter";

interface EventWithStaff extends Event {
  staff: {
    email: string | null;
    name: string | null;
  } | null; // Relation might be null if staff record deleted
}

const toast = useToast();
const columns = [
  { id: "title", key: "title", label: "Title", sortable: true },
  {
    id: "startTimeFormatted",
    key: "startTimeFormatted",
    label: "Start Time",
    sortable: true,
  },
  {
    id: "endTimeFormatted",
    key: "endTimeFormatted",
    label: "End Time",
    sortable: true,
  },
  { id: "location", key: "location", label: "Location", sortable: true },
  { id: "actions", key: "actions", label: "Actions", sortable: false },
];

const {
  data: events,
  status,
  error,
  refresh,
} = await useFetch<EventWithStaff[]>("/api/events");

const formattedEvents = computed(() => {
  if (!Array.isArray(events.value)) {
    return [];
  }

  return events.value.map((event) => ({
    id: event.id,
    title: event.title ?? "N/A",
    startTimeFormatted: formatDisplayDateTime(event.startTime),
    endTimeFormatted: formatDisplayDateTime(event.endTime),
    location: event.location ?? "N/A",
    staffName: event.staff?.name ?? event.staff?.email ?? "Unknown",
    // _originalEvent: event // Optionally pass the whole original event if needed in complex slots
  }));
});

const promptDelete = (eventId: string) => {
  if (
    window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    )
  ) {
    deleteEvent(eventId);
  }
};

const deleteEvent = async (eventId: string) => {
  try {
    await $fetch("/api/events/" + eventId, {
      method: "DELETE",
    });
    toast.add({
      id: `delete-success-${eventId}`,
      title: "Event Deleted",
      description: "The event was successfully removed.",
      icon: "i-heroicons-check-circle",
      color: "green",
    });
    await refresh();
  } catch (error: any) {
    toast.add({
      id: `delete-error-${eventId}`,
      title: "Deletion Failed",
      description:
        error.data?.message || "Could not delete the event. Please try again.",
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  }
};
</script>
