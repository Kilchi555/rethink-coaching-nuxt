// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import * as dotenv from 'dotenv'
import type { NuxtConfig } from '@nuxt/schema'

dotenv.config()

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },

  css: [
    '~/assets/css/main.css',
  ],

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    // BEGINN DER ÄNDERUNG: Explizite Konfiguration für @nuxtjs/tailwindcss
    ['@nuxtjs/tailwindcss', {
      // Wenn deine tailwind.config.ts in der Wurzel des Projekts liegt
      // und den Standardnamen hat, ist keine weitere Konfiguration hier nötig.
      // Falls sie anders heißt oder woanders liegt, könntest du es hier angeben:
      // configPath: './tailwind.config.js',
    }],
    // ENDE DER ÄNDERUNG
    '@pinia/nuxt',
    '@nuxtjs/supabase',
  ],

  // Hier kommt die Konfiguration für @nuxtjs/supabase rein:
  supabase: {
    url: process.env.SUPABASE_URL as string,
    key: process.env.SUPABASE_ANON_KEY as string,
    redirect: false, // Hier wurde bereits auf 'false' geändert, was gut ist
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/register', '/login', '/confirm'],
    },
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    }
  },

  hooks: {
    'app:resolve': () => {
      console.log('✅ Supabase URL:', process.env.SUPABASE_URL)
      console.log('✅ Supabase KEY:', process.env.SUPABASE_ANON_KEY)
    }
  }
} as NuxtConfig) // Hinzufügen der expliziten Typ-Assertion hier