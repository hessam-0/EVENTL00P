<template>
  <UContainer :ui="{ constrained: 'max-w-md' }" class="py-8">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-center">Register New Account</h1>
      </template>

      <form @submit.prevent="handleRegister">
        <UFormGroup label="Name" name="name" class="mb-4" required>
          <UInput
            id="name"
            v-model="name"
            placeholder="Your Name"
            autocomplete="name"
          />
        </UFormGroup>

        <UFormGroup label="Email" name="email" class="mb-4" required>
          <UInput
            id="email"
            type="email"
            v-model="email"
            placeholder="you@example.com"
            autocomplete="email"
          />
        </UFormGroup>

        <UFormGroup name="password" class="mb-4" required>
          <template #label>
            <div class="flex items-center justify-between">
              <span>Password</span>
              <UPopover
                mode="hover"
                :popper="{ placement: 'right-start', arrow: true }"
              >
                <UButton
                  icon="i-heroicons-information-circle"
                  variant="link"
                  color="gray"
                  size="xs"
                  class="p-0"
                  aria-label="Password requirements"
                />
                <template #panel>
                  <div class="p-3 text-sm max-w-xs">
                    {{ passwordHint }}
                  </div>
                </template>
              </UPopover>
            </div>
          </template>
          <UInput
            id="password"
            type="password"
            v-model="password"
            placeholder="••••••••"
            autocomplete="new-password"
          />
        </UFormGroup>

        <UFormGroup
          label="Confirm Password"
          name="confirmPassword"
          class="mb-4"
          required
        >
          <UInput
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            placeholder="••••••••"
            autocomplete="new-password"
          />
        </UFormGroup>

        <UAlert
          v-if="errorMessage"
          icon="i-heroicons-exclamation-triangle"
          color="red"
          variant="soft"
          title="Registration Error"
          :description="errorMessage"
          class="mb-4"
        />

        <UAlert
          v-if="validationErrors && validationErrors.length > 0"
          icon="i-heroicons-information-circle"
          color="red"
          variant="soft"
          title="Please fix the following issues:"
          class="mb-4"
        >
          <template #description>
            <ul>
              <li v-for="(error, index) in validationErrors" :key="index">
                {{ error.message }}
                {{ error.path ? `(${error.path.join(".")})` : "" }}
              </li>
            </ul>
          </template>
        </UAlert>

        <UButton
          type="submit"
          :loading="isLoading"
          block
          label="Register"
          class="mt-6"
        />
      </form>

      <template #footer>
        <p class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?
          <NuxtLink
            to="/login"
            class="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
            >Log In</NuxtLink
          >
        </p>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { navigateTo, useToast } from "#imports";

const passwordHint =
  "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const validationErrors = ref<any[] | null>(null);

const toast = useToast();

async function handleRegister() {
  isLoading.value = true;
  errorMessage.value = null;
  validationErrors.value = null;

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match.";
    isLoading.value = false;
    toast?.add({
      title: "Error",
      description: errorMessage.value,
      color: "red",
    });
    return;
  }

  try {
    await $fetch("/api/users/register", {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
      },
    });

    toast?.add({
      title: "Registration Successful!",
      description: "Please log in.",
      color: "green",
    });

    name.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";

    setTimeout(() => {
      navigateTo("/login");
    }, 1500);
  } catch (error: any) {
    if (error.statusCode === 400 && error.data?.data?.issues) {
      errorMessage.value = "Please check your input.";
      validationErrors.value = error.data.data.issues;
    } else if (error.statusCode === 409) {
      errorMessage.value =
        error.data?.message || "This email address is already registered.";
    } else {
      errorMessage.value =
        error.data?.message ||
        "An unexpected error occurred. Please try again.";
    }
    toast?.add({
      title: "Registration Failed",
      description: errorMessage.value || "An error occurred.",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>
