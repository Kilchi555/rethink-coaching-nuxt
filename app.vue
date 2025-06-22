<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

useAuthStore().initAuth()
</script>


<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
