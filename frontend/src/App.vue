<script setup>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <Navbar v-if="$route.meta.showNavbar" />
  <section
    :class="
      ($route.meta.showNavbar ? 'py-20' : '',
      'fixed inset-0 items-center justify-center pt-20 ')
    "
  >
    <RouterView />
  </section>
</template>
