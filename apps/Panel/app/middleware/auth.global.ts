export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('auth_token')

  const publicRoutes = ['/', '/login', '/registro']

  if (!token.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (token.value && publicRoutes.includes(to.path)) {
    return navigateTo('/dashboard')
  }
})
