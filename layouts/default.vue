<template>
  <div>
    <header>
      <nav>
        <NuxtLink to="/">Home</NuxtLink> |
        <NuxtLink to="/login">Login</NuxtLink> |
        <NuxtLink to="/register">Register</NuxtLink> |
        <NuxtLink to="/dashboard">Dashboard</NuxtLink>
      </nav>
    </header>

    <slot />

    <footer>
      <p>&copy; 2025 Mein Coaching</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Optional: Hier könnten Skripte für dein Layout stehen
</script>

<style scoped>
/* Optional: Hier könnten Styles für dein Layout stehen */
</style>