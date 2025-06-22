// stores/auth.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useSupabaseClient, useSupabaseUser } from '#imports';
import type { User } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
  // State-Variablen
  const user = useSupabaseUser(); // <<< HIER IST DIE WICHTIGSTE ÄNDERUNG
  const userRole = ref<string>('');
  const errorMessage = ref<string | null>(null);
  const loading = ref<boolean>(false);

  // Getter
  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => userRole.value === 'admin');
  const isStaff = computed(() => userRole.value === 'staff');
  const isClient = computed(() => userRole.value === 'client');

  // Aktionen
  // initAuth wird hauptsächlich für den Listener benötigt, nicht für den Initial-Fetch
  const initAuth = () => {
    const supabase = useSupabaseClient();
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // user.value wird bereits durch useSupabaseUser aktualisiert,
        // aber die Rolle muss hier ggf. noch geholt werden
        await fetchUserRole(session.user.id);
      } else {
        userRole.value = ''; // Rolle löschen beim Abmelden
      }
    });
  };

  const login = async (email_val: string, password_val: string) => {
    loading.value = true;
    errorMessage.value = null;
    const supabase = useSupabaseClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email_val,
        password: password_val,
      });

      if (error) throw error;
      // user.value wird durch useSupabaseUser automatisch aktualisiert
      if (user.value) { // Nach erfolgreichem Login Rolle holen
        await fetchUserRole(user.value.id);
      }
      return true;
    } catch (err: any) {
      errorMessage.value = err.message || 'Login fehlgeschlagen.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (email_val: string, password_val: string) => {
    loading.value = true;
    errorMessage.value = null;
    const supabase = useSupabaseClient();

    try {
      const { error } = await supabase.auth.signUp({
        email: email_val,
        password: password_val,
      });

      if (error) throw error;
      // user.value wird durch useSupabaseUser automatisch aktualisiert
      if (user.value) { // Nach Registrierung Rolle holen (wird evtl. leer sein)
          await fetchUserRole(user.value.id);
      }
      return true;
    } catch (err: any) {
      errorMessage.value = err.message || 'Registrierung fehlgeschlagen.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    errorMessage.value = null;
    const supabase = useSupabaseClient();

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // user.value wird durch useSupabaseUser automatisch auf null gesetzt
      userRole.value = '';
    } catch (err: any) {
      errorMessage.value = err.message || 'Abmeldung fehlgeschlagen.';
    } finally {
      loading.value = false;
    }
  };

  const fetchUserRole = async (userId: string) => {
    const supabase = useSupabaseClient();
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role from public.users:', error.message);
        errorMessage.value = 'Konnte Benutzerrolle nicht laden.';
        userRole.value = '';
      } else if (data) {
        userRole.value = data.role || '';
      } else {
        userRole.value = '';
      }
    } catch (err: any) {
      console.error('Unexpected error in fetchUserRole:', err.message);
      errorMessage.value = 'Unerwarteter Fehler beim Laden der Rolle.';
      userRole.value = '';
    }
  };

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
  };
});