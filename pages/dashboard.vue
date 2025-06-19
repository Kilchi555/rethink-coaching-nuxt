<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import CalendarComponent from '~/components/CalendarComponent.vue'

const auth = useAuthStore()
</script>

<template>
  <div class="p-4 space-y-6">
    <h1 class="text-2xl font-bold text-primary">
      Hallo {{ auth.user?.first_name || 'Benutzer' }}
    </h1>

    <CalendarComponent />
  </div>
</template>
