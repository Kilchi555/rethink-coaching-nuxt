// stores/auth.ts
/// <reference types="nuxt" />

import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useSupabaseUser, useSupabaseClient } from '#imports'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const userRole = ref<string>('')
  const errorMessage = ref<string | null>(null)
  const loading = ref<boolean>(false)

  // Computed
  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => userRole.value === 'admin')
  const isStaff = computed(() => userRole.value === 'staff')
  const isClient = computed(() => userRole.value === 'client')

  // Initialisierung
  const initializeUser = async () => {
    const supabaseUser = useSupabaseUser()
    user.value = supabaseUser.value

    if (process.client) {
      watch(supabaseUser, async (newUser: User | null) => {
        user.value = newUser
        if (newUser) {
          await fetchUserRole(newUser.id)
        } else {
          userRole.value = ''
        }
      }, { immediate: true })
    } else {
      if (user.value) {
        await fetchUserRole(user.value.id)
      }
    }
  }

  const initAuth = () => {
    const supabase = useSupabaseClient()
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await fetchUserRole(session.user.id)
      } else {
        user.value = null
        userRole.value = ''
      }
    })
  }

  // Login
  const login = async (email_val: string, password_val: string) => {
    loading.value = true
    errorMessage.value = null
    const supabase = useSupabaseClient()

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email_val,
        password: password_val,
      })
      if (error) throw error
      return true
    } catch (err: any) {
      errorMessage.value = err.message || 'Login fehlgeschlagen.'
      return false
    } finally {
      loading.value = false
    }
  }

  // Registrierung
  const register = async (email_val: string, password_val: string) => {
    loading.value = true
    errorMessage.value = null
    const supabase = useSupabaseClient()

    try {
      const { error } = await supabase.auth.signUp({
        email: email_val,
        password: password_val,
      })
      if (error) throw error
      return true
    } catch (err: any) {
      errorMessage.value = err.message || 'Registrierung fehlgeschlagen.'
      return false
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    loading.value = true
    errorMessage.value = null
    const supabase = useSupabaseClient()

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null
      userRole.value = ''
    } catch (err: any) {
      errorMessage.value = err.message || 'Abmeldung fehlgeschlagen.'
    } finally {
      loading.value = false
    }
  }

  // Rolle laden
  const fetchUserRole = async (userId: string) => {
    const supabase = useSupabaseClient()
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single<{ role: string }>() 

      if (error && error.code !== 'PGRST116') {
        console.error('Fehler beim Laden der Benutzerrolle:', error.message)
        errorMessage.value = 'Konnte Benutzerrolle nicht laden.'
        userRole.value = ''
      } else {
        userRole.value = data?.role || ''
      }
    } catch (err: any) {
      console.error('Unerwarteter Fehler beim Rollen-Fetch:', err.message)
      errorMessage.value = 'Unbekannter Fehler beim Laden der Rolle.'
      userRole.value = ''
    }
  }

  return {
    user,
    userRole,
    errorMessage,
    loading,
    isLoggedIn,
    isAdmin,
    isStaff,
    isClient,
    initAuth,
    login,
    register,
    logout,
    fetchUserRole,
    initializeUser,
  }
})
