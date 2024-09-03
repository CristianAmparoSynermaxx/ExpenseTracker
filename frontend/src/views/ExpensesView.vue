<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import EditExpenseModal from "@/components/EditExpenseModal.vue";
import AddExpenseModal from "@/components/AddExpenseModal.vue";
import { formatDate } from "@/utils/DateFormat";
import Swal from "sweetalert2";

const apiHost = import.meta.env.VITE_host;
const userId = JSON.parse(localStorage.getItem("userData")).id;
const formatter = new Intl.NumberFormat("en-US");

const columns = ref([
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "action", label: "Action" },
]);

const data = ref([]);
const sortColumn = ref("");
const sortOrder = ref("asc");
const searchTerm = ref("");
const itemsPerPage = ref(10);
const currentPage = ref(1);
const isAddExpenseModalOpen = ref(false);
const isEditExpenseModalOpen = ref(false);
const editExpenseId = ref("");
const totalPages = ref(1);

const toggleModal = async (modalRef, fetchFunction) => {
  modalRef.value = !modalRef.value;
  if (!modalRef.value && typeof fetchFunction === "function") {
    await fetchFunction();
  }
};

const toggleAddExpenseModal = () =>
  toggleModal(isAddExpenseModalOpen, fetchExpenses);

const toggleEditExpenseModal = (id) => {
  editExpenseId.value = id;
  toggleModal(isEditExpenseModalOpen, fetchExpenses); // Pass fetchExpenses if needed
};

const fetchExpenses = async () => {
  try {
    const response = await axios.get(`${apiHost}api/expenses/${userId}`, {
      params: {
        page: currentPage.value,
        limit: itemsPerPage.value,
        filterBy: searchTerm.value,
      },
    });

    data.value = response.data.data;
    totalPages.value = response.data.pagination.totalPages;
  } catch (error) {
    console.error("Error fetching expenses: ", error);
  }
};

onMounted(() => {
  fetchExpenses();
});

const sortedData = computed(() => {
  if (!sortColumn.value) return data.value;

  const sorted = [...data.value].sort((a, b) => {
    const aValue = a[sortColumn.value];
    const bValue = b[sortColumn.value];

    if (sortOrder.value === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return sorted;
});

const sortData = (key) => {
  if (sortColumn.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = key;
    sortOrder.value = "asc";
  }
};

const changeItemsPerPage = (size) => {
  itemsPerPage.value = parseInt(size, 10);
  fetchExpenses();
};

const deleteItem = async (id) => {
  // Show confirmation dialog
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.delete(`${apiHost}api/expenses/${id}`);
      console.log(response.data);
      fetchExpenses();
      Swal.fire("Deleted!", "Your item has been deleted.", "success");
      await Swal.fire({
        title: "Deleted!",
        text: `Expense with id ${id} deleted successfully`,
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      Swal.fire("Error", "Failed to delete item", "error");
    }
  } else {
    Swal.fire("Cancelled", "Your item is safe :)", "info");
  }
};

const filteredData = computed(() => {
  if (!searchTerm.value) return sortedData.value;
  return sortedData.value.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  );
});

const changePage = (action) => {
  if (action === "next") {
    if (data.value.length === itemsPerPage.value) {
      currentPage.value++;
      fetchExpenses();
    }
  } else if (action === "prev" && currentPage.value > 1) {
    currentPage.value--;
    fetchExpenses();
  }
};
</script>

<template>
  <main
    class="main-container flex flex-col p-5 pb-28 w-full h-screen overflow-auto"
  >
    <div
      class="flex md:flex-row flex-col gap-5 md:justify-between justify-normal max-w-[1240px] items-center mb-4 w-full mx-auto"
    >
      <h1 class="md:text-2xl text-lg font-bold text-left w-full px-2">
        Expense Information Table
      </h1>
      <div
        class="flex flex-row-reverse gap-2 w-full items-center justify-center"
      >
        <input
          v-model="searchTerm"
          @input="fetchExpenses"
          type="text"
          placeholder="Search..."
          class="py-2 px-3 block w-full leading-5 text-gray-700 border border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 focus:outline-none rounded-md focus:border-gray-500"
        />
        <button
          @click="toggleAddExpenseModal"
          class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded flex gap-2 items-center min-w-max"
        >
          <img class="w-3 h-3" src="/add.png" alt="" />
          Add Expense
        </button>
      </div>
    </div>
    <div
      class="table-container w-full max-w-[1240px] mx-auto lg:text-base text-xs"
    >
      <div class="table-wrapper overflow-x-auto border border-black">
        <table class="w-full min-w-[670px] max-w-[1240px]">
          <thead>
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                class="bg-black text-white"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="h-full overflow-auto">
            <tr v-if="filteredData.length === 0">
              <td :colspan="columns.length" class="text-center h-20">
                There is no record to display
              </td>
            </tr>
            <tr v-for="(item, index) in filteredData" :key="index">
              <td>{{ item.expense_title }}</td>
              <td>{{ item.expense_category }}</td>
              <td>{{ formatDate(item.expense_date) }}</td>
              <td>₱{{ formatter.format(item.expense_amount) }}.00</td>
              <td>
                <button
                  @click="toggleEditExpenseModal(item.id)"
                  class="bg-indigo-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  @click="deleteItem(item.id)"
                  class="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot class="table-footer">
            <tr>
              <td colspan="5">
                <div class="flex justify-between items-center px-5">
                  <div class="flex items-center">
                    <label for="items-per-page" class="mr-2"
                      >Items per page:</label
                    >
                    <select
                      id="items-per-page"
                      v-model="itemsPerPage"
                      @change="changeItemsPerPage($event.target.value)"
                      class="py-2 px-3 border border-gray-300 rounded"
                    >
                      <option
                        v-for="option in [5, 10, 15, 20]"
                        :key="option"
                        :value="option"
                      >
                        {{ option }}
                      </option>
                    </select>
                  </div>
                  <div class="flex items-center">
                    <button
                      @click="changePage('prev')"
                      :disabled="currentPage <= 1"
                      class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded"
                    >
                      Previous
                    </button>
                    <span class="mx-4"
                      >Page {{ currentPage }} of {{ totalPages }}</span
                    >
                    <button
                      @click="changePage('next')"
                      :disabled="currentPage == totalPages"
                      class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
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
  </main>
</template>

<style scoped>
/* Add any custom styles here */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  min-width: 150px;
}

button {
  margin-right: 5px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  color: #666666;
}

/* Ensure the table and footer are always visible and rows scroll horizontally if needed */
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.table-container {
  flex: 1;
  overflow: auto;
}

.table-wrapper {
  overflow-x: auto;
}

tfoot {
  position: sticky;
  bottom: 0;
  background-color: white;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }
}
</style>
