<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
useAuthStore().fetchUser()
</script>


<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
