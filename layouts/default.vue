<!-- layouts/default.vue -->
<template>
  <div>
    <header class="bg-primary text-white p-4 sticky top-0 shadow flex justify-between">
      <div>ReThink Coaching</div>
      <button @click="logout" class="hover:underline">Logout</button>
    </header>

    <main class="p-4">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()

const logout = async () => {
  await auth.logout()
  await navigateTo('/login')
}
</script>
