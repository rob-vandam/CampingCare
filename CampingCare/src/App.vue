<script setup lang="ts">
//import { RouterLink, RouterView } from 'vue-router'
import { onMounted, watchEffect, ref } from 'vue'
import { useAuthStore, getReservations } from './services/CampingConnection.ts'

const authStore = useAuthStore()
interface Reservation {
  id: number
  arrival: string
  departure: string
}

const reservations = ref<Reservation[]>([])

const refreshRes = async () => {
  //console.log('CLICKED')
  const getRes = await getReservations()
  reservations.value = getRes
}

watchEffect(async () => {
  const token = authStore.accessToken
  const adminId = authStore.admin_id

  if (token && adminId) {
    const getRes = await getReservations()
    reservations.value = getRes
    console.log('Reservations:', reservations)
  }
})

onMounted(() => {
  const query = new URLSearchParams(window.location.search)

  if (query.has('authtoken') && query.has('admin_id')) {
    const token = query.get('authtoken')
    const admin_id = query.get('admin_id')
    //console.log('Mounted', token)
    authStore.initializeApp(token, admin_id)
  } else {
    console.warn('Authorization token not found in URL search params')
  }
})
</script>

<template>
  <ul>
    <li v-for="(item, index) in reservations" v-bind:key="index">
      ID: {{ item.id }} - Aankomst: {{ item.arrival.substring(0, 10) }} - Vertrek:
      {{ item.departure.substring(0, 10) }}
    </li>
  </ul>
  <br />
  <button @click="refreshRes">Refresh</button>
</template>

<style scoped></style>
