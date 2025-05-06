<template>
  <div>Loading dashboard...</div>
</template>

<script setup lang="ts">
import { navigateTo } from "#imports";
await navigateTo("/staff/dashboard/events", { replace: true });
</script>
