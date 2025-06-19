export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()
  
    // ⚠️ Seiten wie /login oder / (öffentlich) überspringen
    if (['/login', '/'].includes(to.path)) return
  
    // Wenn kein User → redirect zu Login
    if (!auth.user) {
      return navigateTo('/login')
    }
  })
  