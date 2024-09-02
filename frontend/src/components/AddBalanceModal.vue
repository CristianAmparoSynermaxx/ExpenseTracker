<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const apiHost = import.meta.env.VITE_host;
const userId = JSON.parse(localStorage.getItem("userData")).id;

const props = defineProps({
  toggleAddBalanceModal: Function,
});

const amount = ref(null); // Amount to be added

// Function to add balance
const addBalance = async () => {
  try {
    Swal.showLoading(); // Show loading spinner
    const response = await axios.post(`${apiHost}api/balance/${userId}`, {
      added_balance: amount.value,
    });

    // Log the full response to debug
    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    Swal.fire({
      title: "Success!",
      text: "Balance Added Successfullly",
      icon: "success",
      showConfirmButton: false, // Hide the OK button
      timer: 1000,
    });

    // Close the modal and reset the amount
    props.toggleAddBalanceModal();
  } catch (error) {
    // Log the error object to understand its structure
    console.error("Error:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.error || "Failed to add balance.",
    });
  }
};
</script>

<template>
  <section>
    <div
      class="absolute inset-0 flex justify-center backdrop-blur-sm items-center z-20"
    >
      <div class="px-4 py-10 bg-white h-max shadow-2xl rounded-3xl w-96">
        <div class="max-w-md mx-auto text-black px-2 space-y-5">
          <h1
            class="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl text-center"
          >
            <span class="text-gray-600">Add</span> Balance
          </h1>

          <!-- Amount input group -->
          <div class="relative mt-4">
            <input
              v-model="amount"
              type="number"
              id="amount"
              class="form-input py-2 px-3 block w-full leading-5 text-gray-700 border border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 focus:outline-none rounded-md focus:border-gray-500 peer"
              placeholder=""
            />
            <label for="amount" class="label">Amount</label>
          </div>

          <div class="w-full justify-center flex gap-2 mt-5">
            <button
              class="bg-white text-black hover:text-gray-700 border border-black hover:border-gray-700 font-bold py-2 px-4 rounded"
              @click="toggleAddBalanceModal"
            >
              Cancel
            </button>
            <button
              class="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              @click="addBalance"
            >
              <img class="w-3 h-3" src="/add.png" alt="" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Initial label styling */
.label {
  @apply absolute left-3 top-2  px-1.5 text-sm text-gray-600 transition-all ease-in-out duration-300;
}
input {
  @apply pl-4;
}

/* Apply style changes only when input is focused or not showing placeholder */
input:focus + .label,
input:not(:placeholder-shown) + .label {
  @apply -top-3 left-2 text-sm bg-white text-black;
}
</style>
