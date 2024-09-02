<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const apiHost = import.meta.env.VITE_host;
const userId = JSON.parse(localStorage.getItem("userData")).id;

const props = defineProps({
  toggleAddExpenseModal: Function,
});

// Reactive state for form inputs
const title = ref("");
const amount = ref("");
const category = ref("");

// Handle form submission
const handleSubmit = async (event) => {
  event.preventDefault(); // Prevent the default form submission
  console.log({
    userId,
    title: title.value,
    category: category.value,
    amount: parseFloat(amount.value),
  });

  try {
    const response = await axios.post(`${apiHost}api/expenses`, {
      userId,
      title: title.value,
      category: category.value,
      amount: parseFloat(amount.value),
    });
    Swal.fire({
      title: "Success!",
      text: "Expense Added Successfullly",
      icon: "success",
      showConfirmButton: false, // Hide the OK button
      timer: 1000,
    });

    props.toggleAddExpenseModal();
  } catch (error) {
    Swal.fire("Error", error.response.data.error, "error");
    console.log(error);
  }
};

// Handle cancel button click
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
            <span class="text-gray-600">Add</span> Expense
          </h1>

          <!-- Form element -->
          <form @submit.prevent="handleSubmit" class="space-y-7">
            <!-- Title input group -->
            <div class="relative mt-4">
              <input
                v-model="title"
                type="text"
                id="title"
                class="form-input py-2 px-3 block w-full leading-5 text-gray-700 border border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 focus:outline-none rounded-md focus:border-gray-500 peer"
                placeholder=" "
              />
              <label for="title" class="label">Title</label>
            </div>

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

            <!-- Category select group -->
            <div class="relative mt-4">
              <select
                v-model="category"
                id="category"
                class="form-select py-2 px-3 block w-full leading-5 text-gray-700 border border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 focus:outline-none rounded-md focus:border-gray-500 peer"
              >
                <option value="">Select Category</option>
                <option value="food-dining">Food & Dining</option>
                <option value="transportation">Transportation</option>
                <option value="housing">Housing</option>
                <option value="utilities">Utilities</option>
                <option value="insurance">Insurance</option>
                <option value="healthcare">Healthcare</option>
                <option value="entertainment">Entertainment</option>
                <option value="personal-care">Personal Care</option>
                <option value="education">Education</option>
                <option value="clothing">Clothing</option>
                <option value="gifts-donations">Gifts & Donations</option>
                <option value="travel">Travel</option>
                <option value="savings-investments">
                  Savings & Investments
                </option>
                <option value="miscellaneous">Miscellaneous</option>
              </select>
              <label for="category" class="label">Category</label>
            </div>

            <div class="w-full justify-center flex gap-2 mt-5">
              <button
                type="button"
                class="bg-white text-black hover:text-gray-700 border border-black hover:border-gray-700 font-bold py-2 px-4 rounded"
                @click="toggleAddExpenseModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              >
                <img class="w-3 h-3" src="/add.png" alt="" />
                Add
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
  @apply absolute left-3 top-1.5  px-1.5 text-sm text-gray-600 transition-all ease-in-out duration-300;
}
input {
  @apply pl-4;
}

/* Apply style changes only when input is focused or not showing placeholder */
input:focus + .label,
input:not(:placeholder-shown) + .label {
  @apply -top-3 left-2 text-sm bg-white text-black;
}
select + .label {
  @apply -top-3 left-2 text-sm bg-white text-black;
}
</style>
