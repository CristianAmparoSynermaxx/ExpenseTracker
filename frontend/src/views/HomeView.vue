<script setup>
import ExpenseCard from "@/components/ExpenseCard.vue";
</script>

<template>
  <main class="flex mt-24 justify-center w-full p-5">
    <div class="max-w-[786px] w-full">
      <div
        class="bg-black z-0 rounded-2xl relative h-[144px] w-full text-white flex flex-col items-center justify-center"
      >
        <div class="absolute top-3 right-3 flex gap-1">
          <div
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700"
          >
            <img class="w-4 h-4" src="/add.png" alt="" />
          </div>
          <div
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700"
          >
            <img class="w-4 h-4" src="/edit.png" alt="" />
          </div>
        </div>
        <p class="font-semibold text-base">Total Balance</p>
        <h1 class="font-semibold text-5xl">₱97,000</h1>
      </div>
      <div class="w-full flex justify-between px-4 py-3">
        <h3 class="font-bold text-xl pl-4">Expenses</h3>
        <button
          class="rounded-full px-6 py-2 flex items-center hover:shadow-lg gap-2 text-white font-semibold bg-black"
        >
          <img class="w-3 h-3" src="/add.png" alt="" />
          Add
        </button>
      </div>

      <div class="w-full lg:px-24 px-5 flex flex-col gap-2">
        <ExpenseCard
          title="Almusal"
          category="Food & Beverage"
          :amount="98"
          date="08-19-2024"
        />
        <div
          class="h-[75px] rounded-xl px-10 py-2 flex justify-between shadow-md border border-gray-100"
        >
          <div class="flex flex-col justify-center">
            <h3 class="font-bold text-xl">Almusal</h3>
            <p class="text-xs">Food & Beverages</p>
          </div>
          <div class="flex flex-col justify-center items-center">
            <h3 class="font-bold text-xl">₱97.00</h3>
            <p class="text-xs">08-19-2024</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
