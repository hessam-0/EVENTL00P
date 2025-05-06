<template>
  <UCard
    class="h-96 overflow-hidden"
    :ui="{
      body: { padding: 'p-0 sm:p-0' },
      header: { padding: 'p-0 sm:p-0' },
      footer: { padding: 'px-4 py-4 sm:px-6 sm:py-4' },
    }"
  >
    <div class="flex flex-col h-full">
      <div class="flex-shrink-0">
        <img
          :src="displayImageUrl"
          :alt="`Image for ${event.title}`"
          class="h-32 w-full object-cover"
          loading="lazy"
          @error="handleImageError"
        />
      </div>

      <div class="p-4 flex-grow flex flex-col">
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white mb-2 min-h-[3.5rem]"
        >
          {{ event.title }}
        </h3>
        <div class="space-y-1 text-sm text-gray-500 dark:text-gray-400">
          <p>
            <UIcon
              name="i-heroicons-calendar-days"
              class="mr-1 align-text-bottom"
            />
            {{ formatDisplayDateTime(event.startTime) }}
          </p>
          <p>
            <UIcon name="i-heroicons-map-pin" class="mr-1 align-text-bottom" />
            {{ event.location }}
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <UButton
        :to="eventDetailLink"
        label="View Details"
        color="primary"
        variant="solid"
        block
      />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatDisplayDateTime } from "~/utils/dateFormatter";

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  imageUrl?: string;
}

const props = defineProps<{
  event: Event;
}>();

const eventDetailLink = computed(() => `/events/${props.event.id}`);
const defaultImageUrl = "/images/eventloop_logo.png";
const displayImageUrl = computed(() => {
  return props.event.imageUrl || defaultImageUrl;
});
const handleImageError = (event: globalThis.Event) => {
  const target = event.target as HTMLImageElement;
  if (target && target.src !== defaultImageUrl) {
    target.src = defaultImageUrl;
  }
};
</script>
