<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { onMounted, watchEffect } from 'vue'
import { useAuthStore, getReservations } from './services/CampingConnection.ts'

const authStore = useAuthStore()

watchEffect(() => {
  const token = authStore.accessToken
  const adminId = authStore.admin_id

  if (token && adminId) {
    const reservations = getReservations()
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
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
