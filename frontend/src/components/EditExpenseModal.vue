<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const apiHost = import.meta.env.VITE_host;
const userId = JSON.parse(localStorage.getItem("userData")).id;

// Assume expenseId is passed as a prop
const props = defineProps({
  toggleEditExpenseModal: Function,
  editExpenseId: Number,
});

console.log(props);

// Reactive state for form inputs
const title = ref("");
const amount = ref("");
const category = ref("");

// Fetch expense data when component mounts
onMounted(async () => {
  try {
    const response = await axios.get(
      `${apiHost}api/expenses/expense/${props.editExpenseId}`
    );
    const { expense_title, expense_category, expense_amount } = response.data;
    title.value = expense_title;
    amount.value = expense_amount;
    category.value = expense_category;
  } catch (error) {
    Swal.fire("Error", "Failed to fetch expense data", "error");
    console.log(error);
  }
});

// Handle form submission
const handleEdit = async (event) => {
  event.preventDefault(); // Prevent default form submission

  try {
    await axios.put(`${apiHost}api/expenses/${props.editExpenseId}`, {
      userId,
      title: title.value,
      category: category.value,
      amount: amount.value,
    });

    Swal.fire("Success", "Expense updated successfully!", "success");
    props.toggleEditExpenseModal();
  } catch (error) {
    Swal.fire(
      "Error",
      error.response.data.error || "Failed to update expense",
      "error"
    );
    console.log(error);
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
            <span class="text-gray-600">Edit</span> Expense
          </h1>

          <!-- Form element -->
          <form @submit.prevent="handleEdit" class="space-y-7">
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
                @click="props.toggleEditExpenseModal"
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
  @apply absolute left-3 top-1.5 px-1.5 text-sm text-gray-600 transition-all ease-in-out duration-300;
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
