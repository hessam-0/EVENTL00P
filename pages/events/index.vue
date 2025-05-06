<template>
  <UContainer class="py-8">
    <header class="text-center mb-8">
      <h1
        class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-2"
      >
        Upcoming Events
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        Explore and Join Curated Tech Events
      </p>
    </header>

    <!-- Placeholder: Search/Filtering UI -->
    <div
      class="mt-6 mb-8 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-md"
    >
      <div class="flex flex-wrap items-center gap-4">
        <UInput
          icon="i-heroicons-magnifying-glass"
          placeholder="Search events..."
          class="flex-grow sm:flex-grow-0 sm:w-64"
          disabled
        />
        <USelectMenu
          placeholder="Category"
          :options="['All', 'Workshops', 'Socials', 'Meetings']"
          class="w-48"
          disabled
        />
        <UButton label="Filter" disabled icon="i-heroicons-funnel" />
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
        Search/filtering coming soon!
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="text-center py-16 text-gray-500 dark:text-gray-400"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="animate-spin h-8 w-8 mx-auto"
        aria-hidden="true"
      />
      <p class="mt-2">Loading events...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center py-16 text-red-600 dark:text-red-400"
    >
      <p>Error loading events: {{ error.message }}</p>
    </div>

    <!-- Event List -->
    <div v-else-if="events && events.length">
      <div
        class="flex overflow-x-auto space-x-4 py-4 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:space-x-0 lg:grid-cols-2 xl:grid-cols-3"
      >
        <EventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          class="flex-shrink-0 w-full snap-center md:w-auto"
        />
      </div>
    </div>

    <!-- No Events State -->
    <div v-else class="text-center py-16 text-gray-500 dark:text-gray-400">
      <p>No upcoming events found.</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import EventCard from "~/components/events/EventCard.vue";

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
}
const {
  data: events,
  pending,
  error,
} = useFetch<Event[]>("/api/events", {
  lazy: true,
  default: () => [],
});
</script>
