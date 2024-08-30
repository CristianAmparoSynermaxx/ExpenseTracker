<script setup>
const props = defineProps({
  title: String,
  category: String,
  amount: Number,
  date: String,
});
</script>

<template>
  <div
    class="h-[75px] rounded-xl px-10 py-2 flex justify-between shadow-md border border-gray-100"
  >
    <div class="flex flex-col justify-center">
      <h3 class="font-bold text-xl">{{ title }}</h3>
      <p class="text-xs">{{ category }}</p>
    </div>
    <div class="flex flex-col justify-center items-center">
      <h3 class="font-bold text-xl">₱{{ amount }}.00</h3>
      <p class="text-xs">{{ date }}</p>
    </div>
  </div>
</template>
