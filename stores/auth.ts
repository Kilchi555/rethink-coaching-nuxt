import { defineStore } from 'pinia'

type User = {
    id: number
    email: string
    role: string
    first_name: string
    last_name: string
    assigned_staff_id?: number
    // Weitere Felder wie phone, birthdate etc.
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
          const { data, error } = await useFetch<User>('/api/user', {
            credentials: 'include',
          })
  
          if (data.value) {
            this.user = data.value
          } else {
            this.user = null
          }
        } catch (e) {
          this.user = null
        } finally {
          this.loading = false
        }
      },
  
      logout() {
        this.user = null
        // Session-Cookie auch serverseitig löschen
        return $fetch('/api/logout', {
          method: 'POST',
          credentials: 'include',
        })
      }
      
    }
  })
  

  