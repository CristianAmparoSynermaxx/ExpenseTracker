<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { formatDate } from "@/utils/DateFormat";

const apiHost = import.meta.env.VITE_host;
const userId = JSON.parse(localStorage.getItem("userData")).id;
const formatter = new Intl.NumberFormat("en-US");

const columns = ref([
  { key: "history_date", label: "Date" },
  { key: "remaining_balance", label: "Remaining" },
  { key: "added_balance", label: "Added / Deducted" },
  { key: "new_balance", label: "New Balance" },
]);

const data = ref([]);
const sortColumn = ref("");
const sortOrder = ref("asc");
const itemsPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);

const fetchBalanceHistory = async () => {
  try {
    const response = await axios.get(
      `${apiHost}api/balance/history/${userId}`,
      {
        params: {
          page: currentPage.value,
          limit: itemsPerPage.value,
        },
      }
    );

    data.value = response.data.history;
    totalPage.value = response.data.pagination.totalPages;
  } catch (error) {
    console.error("Error fetching balance history: ", error);
  }
};

onMounted(() => {
  fetchBalanceHistory();
});

const sortedData = computed(() => {
  if (!sortColumn.value) return data.value;

  return [...data.value].sort((a, b) => {
    const aValue = a[sortColumn.value];
    const bValue = b[sortColumn.value];

    if (sortOrder.value === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
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
  fetchBalanceHistory();
};

const changePage = (action) => {
  if (action === "next") {
    currentPage.value++;
    fetchBalanceHistory();
  } else if (action === "prev" && currentPage.value > 1) {
    currentPage.value--;
    fetchBalanceHistory();
  }
};
</script>

<template>
  <main
    class="main-container flex flex-col p-5 pb-28 w-full h-screen overflow-auto"
  >
    <div
      class="flex md:flex-row flex-col md:justify-between justify-normal max-w-[1240px] items-center mb-4 w-full mx-auto"
    >
      <h1 class="lg:text-2xl text-xl font-bold text-left w-full px-5">
        Balance History Table
      </h1>
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
                @click="sortData(column.key)"
                class="cursor-pointer bg-black text-white"
              >
                {{ column.label }}
                <span v-if="sortColumn === column.key">
                  {{ sortOrder === "asc" ? "↑" : "↓" }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody class="h-full overflow-auto">
            <tr v-if="sortedData.length === 0">
              <td :colspan="columns.length" class="text-center h-20">
                There is no record to display
              </td>
            </tr>
            <tr v-for="item in sortedData" :key="item.id">
              <td>{{ formatDate(item.history_date) }}</td>
              <td>₱{{ formatter.format(item.remaining_balance) }}.00</td>
              <td>₱{{ formatter.format(item.added_balance) }}.00</td>
              <td>₱{{ formatter.format(item.new_balance) }}.00</td>
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
                      >Page {{ currentPage }} of {{ totalPage }}</span
                    >
                    <button
                      @click="changePage('next')"
                      :disabled="currentPage == totalPage"
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
}

tbody tr:nth-child(odd) {
  background-color: #fafafa; /* Light background for odd rows */
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
