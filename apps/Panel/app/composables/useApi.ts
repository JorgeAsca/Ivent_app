export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')
  
  const baseURL = import.meta.server ? config.apiBase : config.public.apiBase
  
  const fetchApi = async <T>(endpoint: string, options: any = {}) => {
    const headers = { ...options.headers }
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    return await $fetch<T>(endpoint, {
      baseURL,
      ...options,
      headers
    })
  }

  return { fetchApi, baseURL }
}
