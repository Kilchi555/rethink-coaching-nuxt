/// <reference types="nuxt" />

 <script setup lang="ts">
  import { ref } from 'vue'
  import { useAuthStore } from '~/stores/auth'
  import { useRouter } from 'vue-router'
  import { useFetch } from 'nuxt/app'


  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const auth = useAuthStore()
  const router = useRouter()

  const handleLogin = async () => {
  errorMessage.value = ''
  try {
    const response = await $fetch<{ success: boolean }>(
  '/api/login',
  {
    method: 'POST',
    body: { email: email.value, password: password.value },
    credentials: 'include'
  }
)

    if (!response || !response.success) {
      errorMessage.value = 'Login fehlgeschlagen'
      return
    }

    await auth.fetchUser()
    router.push('/dashboard')
  } catch (err) {
    console.error('Fehler beim Login:', err)
    errorMessage.value = 'Ein Fehler ist aufgetreten'
  }
}

  </script>

  <template>
    <div class="max-w-md mx-auto mt-20 p-6 border shadow rounded bg-white space-y-4">
      <h1 class="text-2xl font-bold text-center text-primary">Login</h1>

      <div>
        <label class="block font-medium mb-1">E-Mail</label>
        <input v-model="email" type="email" class="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label class="block font-medium mb-1">Passwort</label>
        <input v-model="password" type="password" class="w-full border rounded px-3 py-2" />
      </div>

      <div v-if="errorMessage" class="text-red-600 font-medium">{{ errorMessage }}</div>

      <button
        @click="handleLogin"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Einloggen
      </button>
    </div>
  </template>
