<script setup lang="ts">
const auth = useAuthStore()

onMounted(() => {
  if (!auth.user) {
    auth.fetchUser()
  }
})
</script>

<template>
  <div>
    <h1>Willkommen, {{ auth.user?.first_name || 'Gast' }}</h1>
  </div>
</template>
