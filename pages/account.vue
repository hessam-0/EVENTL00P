<template>
  <UContainer class="py-8">
    <h1 class="text-2xl font-semibold mb-6">My Signed-Up Events</h1>

    <div
      v-if="pending"
      class="text-center text-gray-500 dark:text-gray-400 py-10"
    >
      <p>Loading your events...</p>
      <div class="space-y-4 mt-4">
        <div
          v-for="i in 3"
          :key="`skeleton-${i}`"
          class="p-4 border dark:border-gray-700 rounded-md"
        >
          <USkeleton class="h-6 w-3/4 mb-3" />
          <USkeleton class="h-4 w-1/2 mb-2" />
          <USkeleton class="h-4 w-full mb-2" />
          <USkeleton class="h-4 w-5/6 mb-4" />
          <USkeleton class="h-8 w-32" />
        </div>
      </div>
    </div>

    <UAlert
      v-else-if="error"
      title="Error Loading Events"
      :description="
        error?.message || 'Could not load your events. Please try again later.'
      "
      color="red"
      variant="subtle"
      icon="i-heroicons-exclamation-triangle"
      class="mb-4"
    />

    <div
      v-else-if="!signups || signups.length === 0"
      class="text-center text-gray-500 dark:text-gray-400 py-10"
    >
      <p>You haven't signed up for any events yet.</p>
      <UButton to="/events" label="Browse Events" variant="link" class="mt-2" />
    </div>

    <div v-else class="space-y-4">
      <UCard v-for="signup in signups" :key="signup.id">
        <template #header>
          <h2 class="text-lg font-semibold">{{ signup.event.title }}</h2>
        </template>

        <div class="space-y-2">
          <p v-if="signup.event.startTime">
            <strong>When:</strong>
            {{ formatDisplayDateTime(signup.event.startTime) }}
          </p>
          <p v-if="signup.event.location">
            <strong>Where:</strong> {{ signup.event.location }}
          </p>
          <p
            v-if="signup.event.description"
            class="text-sm text-gray-600 dark:text-gray-300"
          >
            {{ signup.event.description }}
          </p>
        </div>

        <template #footer>
          <UButton
            :to="`/events/${signup.event.id}`"
            label="View Event Details"
            variant="outline"
            size="sm"
          />
          <!-- Future enhancement: Add 'Unregister' button -->
        </template>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { useFetch } from "#imports";
import { formatDisplayDateTime } from "~/utils/dateFormatter";

interface EventDetails {
  id: string;
  title: string;
  startTime: string;
  location: string | null;
  description: string | null;
}

interface EventSignUpWithEvent {
  id: string;
  userId: string;
  eventId: string;
  event: EventDetails;
}

definePageMeta({
  middleware: "auth",
});

const {
  data: signups,
  pending,
  error,
} = useFetch<EventSignUpWithEvent[]>("/api/users/me/signups", {
  lazy: true,
  server: false, // Fetch client-side only after middleware ensures auth
});
</script>
