<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()

const logoutAndRedirect = async () => {
  await auth.logout()
  await navigateTo('/login')
}
</script>

<template>
  <header class="flex justify-between p-4 bg-primary text-white sticky top-0 shadow">
    <div>ReThink Coaching</div>
    <button @click="logoutAndRedirect" class="hover:underline">Logout</button>
  </header>
  <main class="p-4">
    <slot />
  </main>
</template>
