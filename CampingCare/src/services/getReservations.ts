const getReservations = async () => {
  const authStore = useAuthStore()
  const token = authStore.accessToken
  const admin_id = authStore.admin_id
  const config = {
    headers: {
      Authorization: `Bearer  ${token}`,
      'x-admin-id': `${admin_id}`,
    },
  }
  const request = axios.get(`${endpoint}/reservations`, config)
  return request.then((response) => response.data)
}
