<!-- layouts/default.vue -->
<template>
  <div>
    <main>
            <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()
</script>
