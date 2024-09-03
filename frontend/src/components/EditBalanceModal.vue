<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const apiHost = import.meta.env.VITE_host;
const userId = JSON.parse(localStorage.getItem("userData")).id;

const props = defineProps({
  toggleEditBalanceModal: Function,
  currentBalance: Number, // Pass the current balance as a prop
});

const amount = ref(props.currentBalance); // Initialize with the current balance

// Function to handle form submission
const handleSubmit = async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Validate the input
  if (!amount.value || amount.value < 0) {
    Swal.fire({
      icon: "warning",
      title: "Invalid Input",
      text: "Please enter a valid amount.",
    });
    return;
  }

  try {
    Swal.showLoading(); // Show loading spinner
    const response = await axios.put(`${apiHost}api/balance/${userId}`, {
      new_balance: amount.value,
    });

    Swal.fire({
      title: "Success!",
      text: "Balance Updated Successfully",
      icon: "success",
      showConfirmButton: false, // Hide the OK button
      timer: 1000,
    });

    // Close the modal and reset the amount
    props.toggleEditBalanceModal();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.error || "Failed to update balance.",
    });
  }
};
</script>

<template>
  <section>
    <div
      class="absolute inset-0 flex justify-center -mt-40 backdrop-blur-sm items-center z-20"
    >
      <div class="px-4 py-10 bg-white h-max shadow-2xl rounded-3xl w-96">
        <div class="max-w-md mx-auto text-black px-2 space-y-5">
          <h1
            class="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl text-center"
          >
            <span class="text-gray-600">Edit</span> Balance
          </h1>

          <!-- Form element -->
          <form @submit="handleSubmit">
            <!-- Amount input group -->
            <div class="relative mt-4">
              <input
                v-model="amount"
                type="number"
                id="amount"
                class="form-input py-2 px-3 block w-full leading-5 text-gray-700 border border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 focus:outline-none rounded-md focus:border-gray-500 peer"
                placeholder=""
                required
              />
              <label for="amount" class="label">Amount</label>
            </div>

            <div class="w-full justify-center flex gap-2 mt-5">
              <button
                type="button"
                class="bg-white text-black hover:text-gray-700 border border-black hover:border-gray-700 font-bold py-2 px-4 rounded"
                @click="props.toggleEditBalanceModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              >
                <img class="w-3 h-3" src="/edit.png" alt="" />
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Initial label styling */
.label {
  @apply absolute left-3 top-2 px-1.5 text-sm text-gray-600 transition-all ease-in-out duration-300;
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
