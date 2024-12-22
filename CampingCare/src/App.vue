<script setup lang="ts">
//import { RouterLink, RouterView } from 'vue-router'
import { onMounted, watchEffect, ref } from 'vue'
import { useAuthStore, getReservations } from './services/CampingConnection.ts'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format } from 'date-fns'
const date = ref<string | null>(null)

const applyDate = async () => {
  if (!date.value) {
    console.error('Invalid date')
    return
  }
  const selectedDate = new Date(date.value) // || undefined
  const formattedDate = format(selectedDate, 'yyyy-MM-dd')
  console.log("Date applied:", formattedDate)
  const getRes = await getReservations(formattedDate)
  reservations.value = getRes
  }


const authStore = useAuthStore()

interface Contact {
  name: string;
}

interface Reservation {
  id: string;
  contact: Contact;
  arrival: string;
  departure: string;
}

const reservations = ref<Reservation[]>([])

const refreshRes = async () => {
  const getRes = await getReservations()
  reservations.value = getRes
  date.value = null
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
    authStore.initializeApp(token, admin_id)
  } else {
    console.warn('Authorization token not found in URL search params')
  }
})
</script>

<template>
  <ul>
    <p>Select arrival date</p>
    <VueDatePicker v-model="date" format="dd-MM-yyyy" auto-apply @update:modelValue="applyDate">
      <p v-if="date">Selected date: {{ date }}</p>
    </VueDatePicker>
    <li v-for="(item, index) in reservations" v-bind:key="index">
      Name: {{ item.contact.name }} ID: {{ item.id }} - Aankomst: {{ item.arrival.substring(0, 10) }} - Vertrek:
      {{ item.departure.substring(0, 10) }}
    </li>
  </ul>
  <br />
  <button @click="refreshRes">Refresh</button>
</template>

<style scoped></style>
