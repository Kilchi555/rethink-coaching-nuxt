<script setup lang="ts">
import { ref } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports' // Oder 'nuxt/app' in manchen Nuxt-Setups, aber '#imports' ist der Standard für Auto-Imports


const email = ref('')
const password = ref('')
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const errorMsg = ref('')

const handleLogin = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMsg.value = error.message
  } else {
    errorMsg.value = ''
    // Workaround für die Weiterleitung:
    window.location.href = '/dashboard' // <-- Ändere DIESE ZEILE
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
    <h1 class="text-2xl font-bold text-center text-primary">Login</h1>

    <input v-model="email" type="email" placeholder="E-Mail"
           class="w-full border rounded px-3 py-2" />
    <input v-model="password" type="password" placeholder="Passwort"
           class="w-full border rounded px-3 py-2" />

    <div v-if="errorMsg" class="text-red-600 text-sm font-medium">{{ errorMsg }}</div>

    <button @click="handleLogin"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
      Einloggen
    </button>
  </div>
</template>
