import { defineStore } from 'pinia'
import axios from 'axios'

const endpoint = 'https://api.camping.care/v21'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    admin_id: null as string | null,
  }),
  actions: {
    async initializeApp(token: string | null, admin_id: string | null) {
      if (token) {
        try {
          const response = await axios.post(`${endpoint}/oauth/token`, { auth_token: token })
          this.accessToken = response.data.idToken
          this.refreshToken = response.data.refreshToken
          this.admin_id = admin_id
          //console.log('Tokendata:', response.data.idToken)
        } catch (error) {
          console.error('Kan tokens niet ophalen:', error)
        }
      }
    },
  },
})

axios.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.accessToken
    const admin_id = authStore.admin_id
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      config.headers['x-Admin-Id'] = `${admin_id}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    //let retryCount = originalRequest._retry || 0
    //console.log(retryCount)
    if (error.response.status === 400 && !originalRequest._retry) {
      originalRequest._retry = true
      //retryCount++
      //const newRequest = { ...originalRequest }
      //newRequest._retry = retryCount
      const authStore = useAuthStore()
      const refreshToken = authStore.refreshToken

      return await axios
        .post(`${endpoint}/oauth/refresh_token`, { refresh_token: refreshToken })
        .then((response) => {
          authStore.accessToken = response.data.id_token
          authStore.refreshToken = response.data.refresh_token

          originalRequest.headers.Authorization = `Bearer ${response.data.idToken}`
          return axios(originalRequest)
        })
        .catch((refreshError) => {
          console.error('Error refreshing token:', refreshError)

          return Promise.reject(error)
        })
    }

    return Promise.reject(error)
  },
)

export const getReservations = async () => {
  const request = axios.get(`${endpoint}/reservations`)
  return request.then((response) => response.data)
}
