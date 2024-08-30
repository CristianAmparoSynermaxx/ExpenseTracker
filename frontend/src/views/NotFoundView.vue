<script setup>
import router from "@/router";

const goBack = () => {
  router.back();
};
</script>
<template>
  <section
    class="text-center flex flex-col justify-center items-center w-full h-screen"
  >
    <i class="fas fa-exclamation-triangle text-yellow-400 fa-4x mb-4"></i>
    <h1 class="text-6xl font-bold mb-4">404 Not Found</h1>
    <p class="text-xl mb-5">This page does not exist</p>
    <button
      @click="goBack"
      class="text-white bg-black hover:bg-gray-900 rounded-md px-3 py-2 mt-4"
    >
      Go Back
    </button>
  </section>
</template>
