<script setup>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <Navbar v-if="$route.meta.showNavbar" />
  <section :class="$route.meta.showNavbar ? 'pt-20' : ''">
    <RouterView />
  </section>
</template>
