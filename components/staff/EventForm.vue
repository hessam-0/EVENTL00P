<template>
  <div>
    <!-- Nuxt UI Form using the consolidated schema and state -->
    <UForm
      :schema="EventFormSchema"
      :state="formData"
      @submit="handleSubmit"
      class="space-y-4"
    >
      <!-- Title -->
      <UFormGroup label="Title" name="title" required>
        <UInput v-model="formData.title" placeholder="Event Title" />
      </UFormGroup>

      <!-- Description -->
      <UFormGroup label="Description" name="description">
        <UTextarea
          v-model="formData.description"
          placeholder="Describe the event..."
          rows="4"
        />
      </UFormGroup>

      <!-- Start Time -->
      <UFormGroup label="Start Time" name="startTime" required>
        <UInput
          type="datetime-local"
          v-model="formData.startTime"
          placeholder="Start Date and Time"
        />
      </UFormGroup>

      <!-- End Time -->
      <UFormGroup label="End Time" name="endTime">
        <UInput
          type="datetime-local"
          v-model="formData.endTime"
          placeholder="End Date and Time (Optional)"
        />
      </UFormGroup>

      <!-- Location -->
      <UFormGroup label="Location" name="location">
        <UInput v-model="formData.location" placeholder="Event Location" />
      </UFormGroup>

      <!-- Image URL - Added from create.vue logic -->
      <UFormGroup label="Image URL (Optional)" name="imageUrl">
        <UInput
          v-model="formData.imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
        />
      </UFormGroup>

      <!-- Submit and Cancel Buttons -->
      <div class="flex justify-end gap-3">
        <UButton
          type="button"
          label="Cancel"
          color="gray"
          variant="ghost"
          @click="handleCancel"
          :disabled="isLoading"
        />
        <UButton
          type="submit"
          :label="isEditing ? 'Update Event' : 'Create Event'"
          :loading="isLoading"
          :disabled="isLoading"
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
// Vue/Nuxt Core
import { computed, reactive, ref, watchEffect, type PropType } from "vue";
import { navigateTo, useToast } from "#imports";

// External Libraries
import type { Event } from "@prisma/client";
import { z } from "zod";

// Project Internal
import { formatIsoForInput } from '~/utils/dateFormatter';

const props = defineProps({
  eventToEdit: {
    type: Object as PropType<Event | null>,
    default: null,
  },
});
const emit = defineEmits(["event-created", "event-updated"]);

const toast = useToast();

const isLoading = ref(false);

const EventFormSchema = z
  .object({
    title: z.string().min(3, "Title requires at least 3 characters"),
    description: z
      .string()
      .min(10, "Description requires at least 10 characters"),
    startTime: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
      message: "Valid start date and time are required",
    }),
    endTime: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "End time must be a valid date if provided",
    }),
    location: z
      .string()
      .min(3, "Location requires at least 3 characters")
      .nullable()
      .optional()
      .or(z.literal("")),
    imageUrl: z
      .string()
      .url({ message: "Must be a valid URL if provided" })
      .nullable()
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        try {
          const startDate = new Date(data.startTime);
          const endDate = new Date(data.endTime);
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            return endDate > startDate;
          }
        } catch {
          return true;
        }
      }
      return true;
    },
    { message: "End time must be after start time", path: ["endTime"] }
  );

const formData = reactive({
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  location: "",
  imageUrl: "",
});

const isEditing = computed(() => !!props.eventToEdit?.id);
const eventId = computed(() => props.eventToEdit?.id);

const resetForm = () => {
  formData.title = "";
  formData.description = "";
  formData.startTime = "";
  formData.endTime = "";
  formData.location = "";
  formData.imageUrl = "";
};

watchEffect(() => {
  if (props.eventToEdit) {
    formData.title = props.eventToEdit.title;
    formData.description = props.eventToEdit.description ?? "";
    formData.startTime = formatIsoForInput(props.eventToEdit.startTime);
    formData.endTime = formatIsoForInput(props.eventToEdit.endTime);
    formData.location = props.eventToEdit.location ?? "";
    formData.imageUrl = props.eventToEdit.imageUrl ?? "";
  } else {
    resetForm();
  }
});

const handleSubmit = async () => {
  isLoading.value = true;
  const bodyToSend = {
    title: formData.title,
    startTime: formData.startTime
      ? new Date(formData.startTime).toISOString()
      : undefined,
    description: formData.description || undefined,
    endTime: formData.endTime
      ? new Date(formData.endTime).toISOString()
      : undefined,
    location: formData.location || undefined,
    imageUrl: formData.imageUrl || undefined,
  };
  const apiPath = isEditing.value
    ? `/api/events/${eventId.value}`
    : "/api/events";
  const method = isEditing.value ? "PUT" : "POST";

  try {
    const result = await $fetch<{
      data?: Event;
      success?: boolean;
      message?: string;
    }>(apiPath, {
      method: method,
      body: bodyToSend,
    });
    const eventTitle = result?.data?.title || bodyToSend.title || "the event";
    toast.add({
      id: `event-${isEditing.value ? "update" : "create"}-success`,
      title: `Event ${isEditing.value ? "Updated" : "Created"}`,
      description: `Event "${eventTitle}" was successfully ${
        isEditing.value ? "updated" : "created"
      }.`,
      icon: "i-heroicons-check-circle",
      color: "green",
    });
    if (isEditing.value) {
      emit("event-updated", result.data || result);
      await navigateTo("/staff/dashboard/events");
    } else {
      emit("event-created", result.data || result);
      resetForm();
    }
  } catch (error: any) {
    console.error(
      `Error ${isEditing.value ? "updating" : "creating"} event:`,
      error.data || error
    );
    let title = `Error ${isEditing.value ? "Updating" : "Creating"} Event`;
    let description = "An unexpected error occurred. Please try again.";
    if (error.response?.status === 400 || error.statusCode === 400) {
      title = "Validation Failed";
      const backendErrors =
        error.data?.details || error.data?.data || error.data?.errors;
      if (backendErrors && Array.isArray(backendErrors)) {
        description = backendErrors.map((e: any) => e.message).join(" ");
      } else {
        description = error.data?.message || "Please check your input values.";
      }
    } else if (
      error.response?.status === 401 ||
      error.statusCode === 401 ||
      error.response?.status === 403 ||
      error.statusCode === 403
    ) {
      title = "Authorization Error";
      description =
        error.data?.message ||
        "You do not have permission to perform this action.";
    } else if (error.response?.status === 404 || error.statusCode === 404) {
      title = "Not Found";
      description =
        error.data?.message ||
        `The event could not be ${isEditing.value ? "updated" : "found"}.`;
    } else if (error.data?.message) {
      description = error.data.message;
    } else if (error.message) {
      description = error.message;
    }
    toast.add({
      id: `event-${isEditing.value ? "update" : "create"}-error`,
      title: title,
      description: description,
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = async () => {
  if (isEditing.value) {
    await navigateTo("/staff/dashboard/events");
  } else {
    resetForm();
  }
};
</script>

<style scoped>
/* Add any specific styles for the form component if needed */
</style>
