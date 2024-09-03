<script setup>
import AddExpenseModal from "@/components/AddExpenseModal.vue";
import ExpenseCard from "@/components/ExpenseCard.vue";
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import EditExpenseModal from "@/components/EditExpenseModal.vue";
import { useRoute } from "vue-router";
import AddBalanceModal from "@/components/AddBalanceModal.vue";
import EditBalanceModal from "@/components/EditBalanceModal.vue";

const apiHost = import.meta.env.VITE_host;
const userId = JSON.parse(localStorage.getItem("userData")).id;
const route = useRoute();

const balance = ref(0);
const totalExpense = ref(0);
const expenses = ref([]);
const formatter = new Intl.NumberFormat("en-US");
const isAddExpenseModalOpen = ref(false);
const isEditExpenseModalOpen = ref(false);
const isAddBalanceModalOpen = ref(false);
const isEditBalanceModalOpen = ref(false);
const editExpenseId = ref("");

const toggleModal = async (modalRef, fetchFunction) => {
  modalRef.value = !modalRef.value;
  if (!modalRef.value && typeof fetchFunction === "function") {
    await fetchFunction();
  }
  fetchBalance();
};

const toggleAddExpenseModal = () =>
  toggleModal(isAddExpenseModalOpen, fetchExpenses);
const toggleAddBalanceModal = () =>
  toggleModal(isAddBalanceModalOpen, fetchBalance);
const toggleEditBalanceModal = () =>
  toggleModal(isEditBalanceModalOpen, fetchBalance);
const toggleEditExpenseModal = (id) => {
  editExpenseId.value = id;
  toggleModal(isEditExpenseModalOpen, fetchExpenses); // Pass fetchExpenses if needed
};

const fetchExpenses = async () => {
  try {
    const response = await axios.get(
      `${apiHost}api/expenses/${userId}?limit=10`
    );
    expenses.value = response.data.data;
    totalExpense.value = response.data.totalAmount;
  } catch (error) {
    Swal.fire("Error", "Failed to fetch expense data", "error");
    console.error(error);
  }
};

const fetchBalance = async () => {
  try {
    const response = await axios.get(`${apiHost}api/balance/${userId}`);
    balance.value = response.data.balance;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchExpenses();
  fetchBalance();
});

watch(
  () => route.path,
  () => {
    fetchExpenses();
    fetchBalance();
  }
);
</script>

<template>
  <main class="flex justify-center w-full p-5 pb-20 z-0 h-full overflow-auto">
    <div class="max-w-[786px] h-full w-full">
      <div
        class="bg-black z-0 rounded-2xl relative lg:h-[144px] h-28 w-full text-white flex flex-col items-center justify-center"
      >
        <div class="absolute top-3 right-3 flex gap-1">
          <button
            @click="toggleAddBalanceModal"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700"
          >
            <img class="w-4 h-4" src="/add.png" alt="" />
          </button>
          <button
            @click="toggleEditBalanceModal"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700"
          >
            <img class="w-4 h-4" src="/edit.png" alt="" />
          </button>
        </div>
        <p class="font-semibold text-base">Total Balance</p>
        <h1 class="font-semibold lg:text-5xl md:text-4xl text-2xl">
          ₱{{ formatter.format(balance) }}
        </h1>
      </div>
      <div class="w-full flex justify-between items-center px-4 py-3">
        <h3 class="font-bold md:text-xl text-lg pl-4">Expenses</h3>
        <button
          @click="toggleAddExpenseModal"
          class="rounded-full px-6 py-2 flex items-center hover:shadow-lg gap-2 text-white font-semibold bg-black md:text-lg text-sm"
        >
          <img class="w-3 h-3" src="/add.png" alt="" />
          Add
        </button>
      </div>

      <div
        class="w-full md:px-12 px-2 h-full max-h-[70%] flex flex-col gap-2 pb-5 overflow-auto border-b-2"
      >
        <ExpenseCard
          v-if="expenses.length > 0"
          v-for="item in expenses"
          @click="toggleEditExpenseModal(item.id)"
          class="bg-white"
          :key="item.id"
          :title="item.expense_title"
          :category="item.expense_category"
          :amount="item.expense_amount"
          :date="item.expense_date"
        />
        <h1
          v-else
          class="textblack w-full flex items-start justify-center h-full"
        >
          There is no record to display
        </h1>
      </div>
      <div class="w-full flex items-center justify-between lg:px-12 px-4">
        <h3
          class="font-bold md:text-lg py-2 text-sm hover:underline cursor-pointer"
        >
          Expense Amount: ₱{{ formatter.format(totalExpense) }}.00
        </h3>
        <h3
          class="font-bold md:text-lg py-2 text-sm hover:underline cursor-pointer"
        >
          See More
        </h3>
      </div>
    </div>

    <AddExpenseModal
      v-if="isAddExpenseModalOpen"
      :toggleAddExpenseModal="toggleAddExpenseModal"
    />
    <EditExpenseModal
      v-if="isEditExpenseModalOpen"
      :toggleEditExpenseModal="toggleEditExpenseModal"
      :editExpenseId="editExpenseId"
    />
    <AddBalanceModal
      v-if="isAddBalanceModalOpen"
      :toggleAddBalanceModal="toggleAddBalanceModal"
    />
    <EditBalanceModal
      v-if="isEditBalanceModalOpen"
      :toggleEditBalanceModal="toggleEditBalanceModal"
      :currentBalance="balance"
    />
  </main>
</template>
