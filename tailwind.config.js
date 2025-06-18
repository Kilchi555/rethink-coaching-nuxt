/** @type {import('tailwindcss').Config} */
export default {
    css: ['~/assets/css/main.css'],
    modules: ['@pinia/nuxt', '@nuxt/ui'],
    content: [
      './components/**/*.{vue,js,ts}',
      './layouts/**/*.{vue,js,ts}',
      './pages/**/*.{vue,js,ts}',
      './app.vue',
      './plugins/**/*.{js,ts}',
      './nuxt.config.ts',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#019ee5',
          secondary: '#28a745',
        },
      },
    },
    plugins: [],
  }
  
  