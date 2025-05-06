<template>
  <UContainer class="flex items-center justify-center min-h-screen py-8">
    <UCard
      class="w-full max-w-sm"
      :ui="{ ring: 'ring-1 ring-gray-300 dark:ring-gray-700' }"
    >
      <h2 class="text-xl font-semibold text-center mb-4">Login</h2>

      <UAlert
        v-if="loginError"
        :title="loginError"
        color="red"
        variant="subtle"
        icon="i-heroicons-exclamation-circle"
        class="mb-4"
      />

      <UForm :state="formData" @submit="handleSubmit" class="space-y-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Email</label
          >
          <UInput
            type="email"
            placeholder="your@email.com"
            v-model="formData.email"
            icon="i-heroicons-envelope"
            class="w-full"
            required
            autocomplete="email"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Password</label
          >
          <UInput
            type="password"
            placeholder="Password"
            v-model="formData.password"
            icon="i-heroicons-lock-closed"
            class="w-full"
            required
            autocomplete="current-password"
          />
        </div>

        <UButton
          type="submit"
          label="Login"
          color="primary"
          block
          :loading="isLoading"
          class="mt-6"
        />
      </UForm>

      <div class="text-center mt-4">
        <span class="text-sm text-gray-600 dark:text-gray-400"
          >Don't have an account?
        </span>
        <ULink
          to="/register"
          class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >Sign up</ULink
        >
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useAuth, navigateTo } from "#imports";

const { signIn, data: sessionData } = useAuth();

const formData = reactive({
  email: "",
  password: "",
});

const isLoading = ref(false);
const loginError = ref("");

const handleSubmit = async () => {
  isLoading.value = true;
  loginError.value = "";

  try {
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      loginError.value =
        result.error === "CredentialsSignin"
          ? "Invalid email or password."
          : result.error || "An unknown authentication error occurred.";
      return;
    }

    if (result?.ok) {
      if (sessionData.value?.user?.role === "staff") {
        await navigateTo("/staff/dashboard");
      } else {
        await navigateTo("/events");
      }
    } else {
      loginError.value =
        "Login failed. Please check your connection and try again.";
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    loginError.value = `Login error: ${message}`;
  } finally {
    isLoading.value = false;
  }
};
</script>
