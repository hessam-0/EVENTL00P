<template>
  <UContainer class="py-8">
    <div class="mb-4">
      <UButton
        to="/events"
        variant="link"
        icon="i-heroicons-arrow-left"
        label="Back to All Events"
        :padded="false"
      />
    </div>

    <div v-if="eventLoadStatus === 'pending'" class="text-center py-10">
      <UAlert
        title="Loading Event Details..."
        icon="i-heroicons-arrow-path"
        color="primary"
        variant="subtle"
        class="inline-flex"
      />
    </div>
    <div v-else-if="eventLoadStatus === 'error'" class="space-y-4">
      <UAlert
        v-if="eventError?.statusCode === 404"
        title="Event Not Found"
        description="Sorry, we couldn't find the event you were looking for."
        icon="i-heroicons-exclamation-circle"
        color="orange"
        variant="subtle"
      />
      <UAlert
        v-else
        title="Error Loading Event"
        :description="
          eventError?.message ||
          'An unexpected error occurred while trying to load the event details.'
        "
        icon="i-heroicons-x-circle"
        color="red"
        variant="subtle"
      />
    </div>

    <UCard v-else-if="eventLoadStatus === 'success' && event">
      <div class="mb-6">
        <img
          :src="event?.imageUrl || placeholderImageUrl"
          @error="onImageError"
          :alt="`Image for ${event?.title || 'event'}`"
          class="w-full h-64 object-cover rounded-lg shadow-md"
        />
      </div>
      <template #header>
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {{ event.title }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              <UIcon name="i-heroicons-user" class="mr-1 align-text-bottom" />
              Created by:
              {{ event.creator?.name || event.creator?.email || "Unknown" }}
            </p>
          </div>
        </div>
      </template>

      <!-- Main Content -->
      <div class="space-y-6">
        <!-- Date & Time -->
        <div class="flex items-start space-x-2">
          <UIcon
            name="i-heroicons-calendar-days"
            class="mt-1 flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400"
          />
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">
              Date & Time
            </h3>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Starts: {{ formatDisplayDateTime(event.startTime) }}
            </p>
            <p
              v-if="event.endTime"
              class="text-sm text-gray-700 dark:text-gray-300"
            >
              Ends: {{ formatDisplayDateTime(event.endTime) }}
            </p>
          </div>
        </div>

        <!-- Location -->
        <div class="flex items-start space-x-2">
          <UIcon
            name="i-heroicons-map-pin"
            class="mt-1 flex-shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400"
          />
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">Location</h3>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              {{ event.location || "Not specified" }}
            </p>
          </div>
        </div>

        <!-- Description -->
        <div v-if="event.description">
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">
            Description
          </h3>
          <div
            class="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
          >
            <p>{{ event.description }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div
              v-if="authStatus === 'authenticated'"
              class="flex items-center space-x-2"
            >
              <UButton
                v-if="isLoadingStatus"
                loading
                label="Checking..."
                disabled
                class="w-32"
              />
              <UButton
                v-else-if="isSignedUp"
                @click="handleUnsubscribe"
                :loading="isSubmitting"
                label="Unsubscribe"
                color="red"
                :disabled="isSubmitting"
                class="w-32"
              />
              <UButton
                v-else
                @click="handleSignUp"
                :loading="isSubmitting"
                label="Sign Up"
                color="primary"
                :disabled="isSubmitting"
                class="w-32"
              />

              <UButton
                v-if="!isLoadingStatus && isSignedUp"
                :to="googleCalendarUrl"
                target="_blank"
                label="Add to Calendar"
                color="primary"
                variant="outline"
                icon="i-heroicons-calendar-plus"
                :disabled="!event || isSubmitting"
              />
            </div>

            <UButton
              v-else
              to="/login"
              label="Log in to sign up"
              color="primary"
              variant="outline"
              icon="i-heroicons-arrow-right"
            />
          </div>

          <!-- Right Group: Placeholder Buttons -->
          <div class="flex items-center gap-1">
            <UTooltip
              :text="
                isInterested ? 'Mark as not interested' : 'Mark as interested'
              "
            >
              <UButton
                :icon="
                  isInterested ? 'i-heroicons-star-solid' : 'i-heroicons-star'
                "
                variant="ghost"
                color="gray"
                @click="isInterested = !isInterested"
                aria-label="Toggle interested status"
              />
            </UTooltip>
            <!-- Share Popover -->
            <UPopover
              mode="click"
              :popper="{ placement: 'bottom-end', strategy: 'absolute' }"
            >
              <UButton
                label="Share"
                icon="i-heroicons-share"
                variant="ghost"
                color="gray"
                aria-label="Share event"
                :disabled="!event"
              />

              <template #panel>
                <div class="p-1 space-y-1">
                  <p
                    class="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 mb-0.5"
                  >
                    Share via:
                  </p>

                  <!-- Twitter Share Option -->
                  <ClientOnly>
                    <ShareNetwork
                      network="twitter"
                      :url="pageUrl"
                      :title="event?.title || 'Check out this event!'"
                      :disabled="!event || !pageUrl"
                    >
                      <UButton
                        variant="ghost"
                        color="gray"
                        padded
                        size="sm"
                        :disabled="!event || !pageUrl"
                        class="flex items-center gap-x-1.5 flex-shrink-0"
                      >
                        <Icon
                          name="simple-icons:x"
                          class="w-4 h-4 flex-shrink-0"
                        />
                        <span class="whitespace-nowrap">Twitter / X</span>
                      </UButton>
                    </ShareNetwork>
                    <template #fallback>
                      <UButton
                        variant="ghost"
                        color="gray"
                        padded
                        size="sm"
                        disabled
                        class="flex items-center gap-x-1.5 flex-shrink-0"
                      >
                        <Icon
                          name="simple-icons:x"
                          class="w-4 h-4 flex-shrink-0 opacity-50"
                        />
                        <span class="opacity-50 whitespace-nowrap"
                          >Twitter / X</span
                        >
                      </UButton>
                    </template>
                  </ClientOnly>

                  <!-- Facebook Share Option -->
                  <ClientOnly>
                    <ShareNetwork
                      network="facebook"
                      :url="pageUrl"
                      :title="event?.title || 'Check out this event!'"
                      :quote="`Check out this event: ${event?.title || ''}`"
                      :disabled="!event || !pageUrl"
                    >
                      <UButton
                        variant="ghost"
                        color="gray"
                        padded
                        size="sm"
                        :disabled="!event || !pageUrl"
                        class="flex items-center gap-x-1.5 flex-shrink-0"
                      >
                        <Icon
                          name="simple-icons:facebook"
                          class="w-4 h-4 flex-shrink-0"
                        />
                        <span class="whitespace-nowrap">Facebook</span>
                      </UButton>
                    </ShareNetwork>
                    <template #fallback>
                      <UButton
                        variant="ghost"
                        color="gray"
                        padded
                        size="sm"
                        disabled
                        class="flex items-center gap-x-1.5 flex-shrink-0"
                      >
                        <Icon
                          name="simple-icons:facebook"
                          class="w-4 h-4 flex-shrink-0 opacity-50"
                        />
                        <span class="opacity-50 whitespace-nowrap"
                          >Facebook</span
                        >
                      </UButton>
                    </template>
                  </ClientOnly>

                  <!-- Reddit Share Option -->
                  <ClientOnly>
                    <ShareNetwork
                      network="reddit"
                      :url="pageUrl"
                      :title="event?.title || 'Check out this event!'"
                      :disabled="!event || !pageUrl"
                    >
                      <UButton
                        variant="ghost"
                        color="gray"
                        padded
                        size="sm"
                        :disabled="!event || !pageUrl"
                        class="flex items-center gap-x-1.5 flex-shrink-0"
                      >
                        <Icon
                          name="simple-icons:reddit"
                          class="w-4 h-4 flex-shrink-0"
                        />
                        <span class="whitespace-nowrap">Reddit</span>
                      </UButton>
                    </ShareNetwork>
                    <template #fallback>
                      <UButton
                        variant="ghost"
                        color="gray"
                        padded
                        size="sm"
                        disabled
                        class="flex items-center gap-x-1.5 flex-shrink-0"
                      >
                        <Icon
                          name="simple-icons:reddit"
                          class="w-4 h-4 flex-shrink-0 opacity-50"
                        />
                        <span class="opacity-50 whitespace-nowrap">Reddit</span>
                      </UButton>
                    </template>
                  </ClientOnly>

                  <ClientOnly>
                    <ShareNetwork
                      network="email"
                      :url="pageUrl"
                      :title="`Check out this event: ${event?.title || ''}`"
                      :description="`Found this event, thought you might like it:\n${pageUrl}`"
                      :disabled="!event || !pageUrl"
                    >
                      <UButton
                        variant="ghost"
                        color="gray"
                        padded
                        size="sm"
                        :disabled="!event || !pageUrl"
                        class="flex items-center gap-x-1.5 flex-shrink-0"
                      >
                        <Icon
                          name="simple-icons:maildotru"
                          class="w-4 h-4 flex-shrink-0"
                        />
                        <span class="whitespace-nowrap">Email</span>
                      </UButton>
                    </ShareNetwork>
                    <template #fallback>
                      <UButton
                        variant="ghost"
                        color="gray"
                        padded
                        size="sm"
                        disabled
                        class="flex items-center gap-x-1.5 flex-shrink-0"
                      >
                        <Icon
                          name="simple-icons:maildotru"
                          class="w-4 h-4 flex-shrink-0 opacity-50"
                        />
                        <span class="opacity-50 whitespace-nowrap">Email</span>
                      </UButton>
                    </template>
                  </ClientOnly>
                </div>
              </template>
            </UPopover>
          </div>
        </div>
      </template>
    </UCard>

    <div v-else class="text-center py-10">
      <UAlert
        title="Event Data Missing"
        description="Event data is unexpectedly empty even though the request succeeded."
        icon="i-heroicons-question-mark-circle"
        color="orange"
        variant="subtle"
        class="inline-flex"
      />
    </div>
    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Discussion
      </h2>
      <div class="space-y-3">
        <UTextarea
          color="gray"
          variant="outline"
          placeholder="Add your comment..."
          disabled
          :rows="3"
        />
        <UButton label="Post Comment" color="gray" disabled />
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useToast, useFetch, useRequestHeaders, useAuth } from "#imports";
import { format } from "date-fns";
import { type Event } from "@prisma/client";
import { formatDisplayDateTime } from "~/utils/dateFormatter";
interface EventWithCreator extends Event {
  creator: {
    email: string | null;
    name: string | null;
  } | null;
}

const { data: session, status: authStatus } = useAuth();
const route = useRoute();
const toast = useToast();
const placeholderImageUrl = ref("/images/eventloop_logo.png");
const isLoadingStatus = ref(true);
const isSubmitting = ref(false);
const isInterested = ref(false);
const isSignedUp = ref(false);

const eventId = computed(() => route.params.id as string);
const apiUrl = computed(() => `/api/events/${eventId.value}`);
const pageUrl = computed(() =>
  import.meta.client ? window.location.href : ""
);

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== placeholderImageUrl.value) {
    console.warn(
      `Failed to load image: ${target.src}. Falling back to placeholder.`
    );
    target.src = placeholderImageUrl.value;
  } else {
    console.error("Failed to load placeholder image.");
    target.style.display = "none";
  }
};

const {
  data: event,
  status: eventLoadStatus,
  error: eventError,
} = useFetch<EventWithCreator | null>(apiUrl, {
  key: `event-${eventId.value}`,
  watch: [eventId],
});

watchEffect(async () => {
  if (!eventId.value) {
    isSignedUp.value = false;
    isLoadingStatus.value = false;
    return;
  }

  if (authStatus.value !== "loading") {
    if (authStatus.value === "authenticated") {
      isLoadingStatus.value = true;
      try {
        const signupStatusResult = await $fetch<{ isSignedUp: boolean }>(
          `/api/users/me/signups/${eventId.value}`,
          {
            method: "GET",
            headers: useRequestHeaders(["cookie"]),
          }
        );
        isSignedUp.value = signupStatusResult.isSignedUp;
      } catch (err: any) {
        if (err.response?.status === 404) {
          isSignedUp.value = false;
        } else {
          toast.add({
            title: "Error",
            description: "Could not check sign-up status.",
            color: "red",
          });
          isSignedUp.value = false;
        }
      } finally {
        isLoadingStatus.value = false;
      }
    } else {
      isSignedUp.value = false;
      isLoadingStatus.value = false;
    }
  } else {
    isLoadingStatus.value = true;
    isSignedUp.value = false;
  }
});
const googleCalendarUrl = computed<string>(() => {
  if (!event.value) return "#";

  const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
  const formatGoogleDate = (date: Date | string | null | undefined): string => {
    if (!date) return "";
    try {
      const d = new Date(date);
      const year = d.getUTCFullYear();
      const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
      const day = d.getUTCDate().toString().padStart(2, "0");
      const hours = d.getUTCHours().toString().padStart(2, "0");
      const minutes = d.getUTCMinutes().toString().padStart(2, "0");
      const seconds = d.getUTCSeconds().toString().padStart(2, "0");
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    } catch (e) {
      console.error("Error formatting date for Google Calendar:", date, e);
      return "";
    }
  };

  const startTimeGoogle = formatGoogleDate(event.value.startTime);
  const endTimeGoogle = formatGoogleDate(
    event.value.endTime || event.value.startTime
  );

  const params = new URLSearchParams();
  params.append("text", event.value.title || "");
  params.append("dates", `${startTimeGoogle}/${endTimeGoogle}`);
  if (event.value.description)
    params.append("details", event.value.description);
  if (event.value.location) params.append("location", event.value.location);

  return `${baseUrl}&${params.toString()}`;
});

async function handleSignUp() {
  if (isSubmitting.value || !eventId.value) return;
  isSubmitting.value = true;
  console.log("Handling Sign Up for event:", eventId.value);
  try {
    await $fetch(`/api/events/${eventId.value}/signup`, {
      method: "POST",
      headers: useRequestHeaders(["cookie"]),
    });
    isSignedUp.value = true;
    toast.add({
      id: `signup-success-${Date.now()}`,
      title: "Signed Up!",
      description: "You can now add this event to your Google calendar.",
      icon: "i-heroicons-check-circle",
      color: "green",
      timeout: 5000,
    });
  } catch (error: any) {
    console.error("Signup failed:", error);
    const errorMessage =
      error.data?.message || "Could not complete signup. Please try again.";
    toast.add({
      id: `signup-error-${Date.now()}`,
      title: "Sign Up Failed",
      description: errorMessage,
      icon: "i-heroicons-x-circle",
      color: "red",
      timeout: 5000,
    });
  } finally {
    isSubmitting.value = false;
  }
}

async function handleUnsubscribe() {
  if (isSubmitting.value || !eventId.value) return;
  isSubmitting.value = true;
  console.log("Handling Unsubscribe for event:", eventId.value);
  try {
    await $fetch(`/api/events/${eventId.value}/signup`, {
      method: "DELETE",
      headers: useRequestHeaders(["cookie"]),
    });
    isSignedUp.value = false;
    toast.add({
      id: `unsubscribe-success-${Date.now()}`,
      title: "Unsubscribed",
      description: "You are no longer signed up for this event.",
      icon: "i-heroicons-check-circle",
      color: "green",
      timeout: 5000,
    });
  } catch (error: any) {
    console.error("Unsubscribe failed:", error);
    const errorMessage =
      error.data?.message ||
      "Could not complete unsubscribe. Please try again.";
    toast.add({
      id: `unsubscribe-error-${Date.now()}`,
      title: "Unsubscribe Failed",
      description: errorMessage,
      icon: "i-heroicons-x-circle",
      color: "red",
      timeout: 5000,
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>
