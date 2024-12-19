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
          console.log('Tokendata:', response.data.idToken)
        } catch (error) {
          console.error('Kan tokens niet ophalen:', error)
        }
      }
    },
  },
})

export const getReservations = async () => {
  const authStore = useAuthStore()
  const token = authStore.accessToken
  console.log('ReservationsToken:', token)
  const admin_id = authStore.admin_id
  const config = {
    headers: {
      Accept: 'application/json, text/plain, */*',
      Authorization: `Bearer ${token}`,
      'x-Admin-Id': `${admin_id}`,
    },
  }
  axios.interceptors.request.use((config) => {
    console.log('Request Headers:', config.headers)
    return config
  })
  const request = axios.get(`${endpoint}/reservations`, config)
  return request.then((response) => response.data)
}
