<script setup lang="ts">
import { ref } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { navigateTo } from 'nuxt/app'

const email = ref('')
const password = ref('')
const supabase = useSupabaseClient()
const user = useSupabaseUser() // user ist ein Ref, das automatisch aktualisiert wird
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

    // Warten, bis der user-Ref aktualisiert wird (optional, aber oft hilfreich)
    // Dies ist wichtig, wenn die Zielseite eine Middleware hat, die auf den angemeldeten Benutzer prüft.
    await new Promise(resolve => setTimeout(resolve, 100)); // Kurze Verzögerung

    // Überprüfen, ob der Benutzer jetzt eingeloggt ist
    if (user.value) { // 'user' ist ein Ref, also user.value prüfen
      await navigateTo('/dashboard') // Hier navigateTo korrekt awaiten
    } else {
      // Fallback oder Fehlerbehandlung, falls user.value nicht aktualisiert wird
      console.error('Login erfolgreich, aber Benutzerstatus nicht aktualisiert. Navigiere trotzdem.');
      await navigateTo('/dashboard'); // Dennoch navigieren
    }
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