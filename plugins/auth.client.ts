// plugins/auth.client.ts
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(() => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  console.log('✅ User from Supabase:', user.value)
  console.log('✅ Supabase client:', supabase)
})
