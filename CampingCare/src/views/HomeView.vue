<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()
let testParam = null

onMounted(() => {
  testParam = route.query.test
  console.log('Home1:', testParam)
})

// Gebruik productId om data op te halen of andere acties uit te voeren
console.log('Home:', testParam)
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
