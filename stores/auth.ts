// stores/auth.ts
import { defineStore } from 'pinia'

export type User = {
  id: number
  email: string
  role: string
  first_name: string
  last_name: string
  assigned_staff_id?: number
  phone?: string
  birthdate?: string
  // ...weitere Felder falls nötig
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
  }),

  actions: {
    async fetchUser() {
      this.loading = true
      try {
        const user = await $fetch<User>('/api/user', {
          credentials: 'include',
        })

        this.user = user ?? null
      } catch (error) {
        console.error('Fehler beim Fetch des Benutzers:', error)
        this.user = null
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await $fetch('/api/logout', {
          method: 'POST',
          credentials: 'include',
        })
      } catch (error) {
        console.warn('Logout-Fehler (evtl. bereits ausgeloggt):', error)
      } finally {
        this.user = null
      }
    },
  },
})
